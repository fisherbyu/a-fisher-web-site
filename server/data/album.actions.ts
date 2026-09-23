'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AlbumInput } from '@/types';
import { requireAdmin } from '../auth';
import { createAlbum, updateAlbum } from './album';
import { formatZodList } from '@/lib';

/** Shape returned to `useActionState`; `errors` is keyed by form field name */
export type AlbumFormState = {
    /** Field-level validation messages */
    errors?: Record<string, string[]>;
    /** Top-level failure message, shown above the form */
    message?: string;
};

/** Field lengths mirror the `VarChar` limits in the Prisma schema */
const albumSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100),
    releaseDate: z
        .string()
        .trim()
        .default('')
        .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Use YYYY-MM-DD')
        .transform((value) => (value ? new Date(`${value}T00:00:00Z`) : undefined)),
    contents: z
        .array(z.string())
        .transform((texts) => texts.map((text) => text.trim()).filter(Boolean)),
    favoriteTracks: formatZodList(255),
    appleURI: z.string().trim().max(255).default(''),
    spotifyURI: z.string().trim().max(255).default(''),
    imageSrc: z.string().trim().min(1, 'An image is required').max(255),
    imageAlt: z.string().trim().max(255).default(''),
    imageWidth: z.coerce.number().int().positive(),
    imageHeight: z.coerce.number().int().positive(),
    // `Genre.name` is uniquely indexed, so dedupe before the write
    genres: formatZodList(50).transform((names) => [...new Set(names)]),
});

type ParseResult =
    | { success: true; data: Omit<AlbumInput, 'artistId'> }
    | { success: false; state: AlbumFormState };

/** Reads the album form fields and reshapes them into an `AlbumInput` */
const parseAlbumForm = (formData: FormData): ParseResult => {
    const parsed = albumSchema.safeParse({
        title: formData.get('title'),
        releaseDate: formData.get('releaseDate'),
        contents: formData.getAll('contents'),
        favoriteTracks: formData.get('favoriteTracks'),
        appleURI: formData.get('appleURI'),
        spotifyURI: formData.get('spotifyURI'),
        imageSrc: formData.get('imageSrc'),
        imageAlt: formData.get('imageAlt'),
        imageWidth: formData.get('imageWidth'),
        imageHeight: formData.get('imageHeight'),
        genres: formData.get('genres'),
    });

    if (!parsed.success) {
        return { success: false, state: { errors: z.flattenError(parsed.error).fieldErrors } };
    }

    const { appleURI, spotifyURI, imageSrc, imageAlt, imageWidth, imageHeight, genres, ...rest } =
        parsed.data;

    return {
        success: true,
        data: {
            ...rest,
            link: { appleURI, spotifyURI },
            image: {
                src: imageSrc,
                alt: imageAlt,
                width: imageWidth,
                height: imageHeight,
            },
            genres: genres.map((name) => ({ name })),
        },
    };
};

/**
 * Creates an Album under the given artist. Image upload happens client-side;
 * this receives the resulting metadata as hidden fields.
 *
 * @example
 * const action = createAlbumAction.bind(null, artistId);
 * const [state, formAction, pending] = useActionState(action, {});
 */
export const createAlbumAction = async (
    artistId: number,
    prevState: AlbumFormState,
    formData: FormData
): Promise<AlbumFormState> => {
    await requireAdmin();

    const parsed = parseAlbumForm(formData);
    if (!parsed.success) return parsed.state;

    try {
        await createAlbum({ ...parsed.data, artistId });
    } catch (error) {
        // Prisma messages can leak schema details, so log and return generic copy
        console.error('Failed to create album:', error);
        return { message: 'Could not save this album. Please try again.' };
    }

    revalidatePath('/admin/albums');
    redirect('/admin/albums');
};

/**
 * Updates an existing Album. `id` is bound server-side rather than read from
 * the form, so it can't be swapped by the client. The artist relation is
 * fixed at creation and never changes here.
 *
 * @example
 * const action = updateAlbumAction.bind(null, album.id);
 * const [state, formAction, pending] = useActionState(action, {});
 */
export const updateAlbumAction = async (
    id: number,
    prevState: AlbumFormState,
    formData: FormData
): Promise<AlbumFormState> => {
    await requireAdmin();

    const parsed = parseAlbumForm(formData);
    if (!parsed.success) return parsed.state;

    try {
        await updateAlbum(id, parsed.data);
    } catch (error) {
        console.error('Failed to update album:', error);
        return { message: 'Could not save this album. Please try again.' };
    }

    revalidatePath('/admin/albums');
    redirect('/admin/albums');
};
