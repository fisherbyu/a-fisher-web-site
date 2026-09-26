'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Tier } from '@prisma/client';
import { RankingListInput } from '@/types';
import { requireAdmin } from '../auth';
import { createRankingList, updateRankingList } from './ranking-list';

/** Shape returned to `useActionState`; `errors` is keyed by form field name */
export type RankingListFormState = {
    /** Field-level validation messages */
    errors?: Record<string, string[]>;
    /** Top-level failure message, shown above the form */
    message?: string;
};

/** One row of the ranking form */
const rankingEntrySchema = z.object({
    musicItemId: z.coerce.number().int().positive(),
    tier: z.enum(Tier).optional(),
    position: z.coerce.number().int().positive().optional(),
});

/** Field lengths mirror the `VarChar` limits in the Prisma schema; entry checks mirror its unique constraints */
const rankingListSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    slug: z
        .string()
        .trim()
        .min(1, 'Slug is required')
        .max(100)
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and dashes'),
    // Entries arrive as JSON in a single `entries` field
    entries: z
        .string()
        .default('[]')
        .transform((value, ctx) => {
            try {
                return JSON.parse(value);
            } catch {
                ctx.addIssue({ code: 'custom', message: 'Could not read the submitted order' });
                return z.NEVER;
            }
        })
        .pipe(z.array(rankingEntrySchema))
        // `list_item`: an item appears once per list
        .refine(
            (entries) => new Set(entries.map((e) => e.musicItemId)).size === entries.length,
            'An item can only appear once in a ranking list'
        )
        // `list_tier_position`: a position is used once per tier (untiered positions share one slot)
        .refine((entries) => {
            const slots = entries
                .filter((e) => e.position !== undefined)
                .map((e) => `${e.tier ?? ''}:${e.position}`);
            return new Set(slots).size === slots.length;
        }, 'Two items share the same position'),
});

type ParseResult =
    | { success: true; data: Omit<RankingListInput, 'artistId'> }
    | { success: false; state: RankingListFormState };

/** Reads the ranking list form fields and reshapes them into a `RankingListInput` */
const parseRankingListForm = (formData: FormData): ParseResult => {
    const parsed = rankingListSchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug'),
        // `get` returns null for a missing field; undefined lets `.default` apply
        entries: formData.get('entries') ?? undefined,
    });

    if (!parsed.success) {
        return { success: false, state: { errors: z.flattenError(parsed.error).fieldErrors } };
    }

    return { success: true, data: parsed.data };
};

/**
 * Creates a RankingList. Pass an `artistId` to scope the list to that
 * artist's albums, or `undefined` for a general list.
 *
 * @example
 * const action = createRankingListAction.bind(null, artistId);
 * const [state, formAction, pending] = useActionState(action, {});
 */
export const createRankingListAction = async (
    artistId: number | undefined,
    prevState: RankingListFormState,
    formData: FormData
): Promise<RankingListFormState> => {
    await requireAdmin();

    const parsed = parseRankingListForm(formData);
    if (!parsed.success) return parsed.state;

    try {
        await createRankingList({ ...parsed.data, artistId });
    } catch (error) {
        // Prisma messages can leak schema details, so log and return generic copy
        console.error('Failed to create ranking list:', error);
        return { message: 'Could not save this ranking list. Please try again.' };
    }

    revalidatePath('/admin/ranking');
    redirect('/admin/ranking');
};

/**
 * Updates an existing RankingList. `id` is bound server-side rather than read
 * from the form, so it can't be swapped by the client. The artist scope is
 * fixed at creation and never changes here.
 *
 * @example
 * const action = updateRankingListAction.bind(null, list.id);
 * const [state, formAction, pending] = useActionState(action, {});
 */
export const updateRankingListAction = async (
    id: number,
    prevState: RankingListFormState,
    formData: FormData
): Promise<RankingListFormState> => {
    await requireAdmin();

    const parsed = parseRankingListForm(formData);
    if (!parsed.success) return parsed.state;

    try {
        await updateRankingList(id, parsed.data);
    } catch (error) {
        console.error('Failed to update ranking list:', error);
        return { message: 'Could not save this ranking list. Please try again.' };
    }

    revalidatePath('/admin/ranking');
    redirect('/admin/ranking');
};
