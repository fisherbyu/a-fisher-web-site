'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Tier } from '@prisma/client';
import { RankingEntryInput } from '@/types';
import { requireAdmin } from '../auth';
import { updateRankingList } from './ranking-list';

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

/** Entries arrive as JSON in a single `entries` field; checks mirror the Prisma unique constraints */
const rankingListSchema = z.object({
    entries: z
        .string()
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
    | { success: true; data: RankingEntryInput[] }
    | { success: false; state: RankingListFormState };

/** Reads the ranking form fields and reshapes them into `RankingEntryInput`s */
const parseRankingListForm = (formData: FormData): ParseResult => {
    const parsed = rankingListSchema.safeParse({
        entries: formData.get('entries'),
    });

    if (!parsed.success) {
        return { success: false, state: { errors: z.flattenError(parsed.error).fieldErrors } };
    }

    return { success: true, data: parsed.data.entries };
};

/**
 * Updates an existing RankingList's entries. `id` is bound server-side rather
 * than read from the form, so it can't be swapped by the client.
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
        // Prisma messages can leak schema details, so log and return generic copy
        console.error('Failed to update ranking list:', error);
        return { message: 'Could not save this ranking list. Please try again.' };
    }

    revalidatePath('/admin/rankings');
    redirect('/admin/rankings');
};
