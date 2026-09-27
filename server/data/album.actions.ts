'use server';
import { z } from 'zod';
import { AlbumInput } from '@/types';
import { requireAdmin } from '../auth';
import { createAlbum, updateAlbum } from './album';
import { formatZodList } from '@/lib';
import { storeFormImage } from '@/server/media';

/** Shape returned to `useActionState`; `errors` is keyed by form field name */
export type AlbumFormState = {
    /** Field-level validation messages */
    errors?: Record<string, string[]>;
    /** Top-level failure message, shown above the form */
    message?: string;
    /** Id of the record just saved; set only on success */
    savedId?: number;
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
    imageAlt: z.string().trim().max(255).default(''),
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
        imageAlt: formData.get('imageAlt'),
        genres: formData.get('genres'),
    });

    if (!parsed.success) {
        return { success: false, state: { errors: z.flattenError(parsed.error).fieldErrors } };
    }

    const { appleURI, spotifyURI, imageAlt, genres, ...rest } = parsed.data;

    return {
        success: true,
        data: {
            ...rest,
            link: { appleURI, spotifyURI },
            // `stored` is added by the action once the uploaded file is processed
            image: { alt: imageAlt },
            genres: genres.map((name) => ({ name })),
        },
    };
};

/**
 * Creates an Album under the given artist. The image file rides along in
 * the form data and is processed into MEDIA_ROOT before the row is saved.
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

    const { stored, error: imageError } = await storeFormImage(formData, {
        folder: 'music/album',
        name: parsed.data.title,
        required: true,
    });
    if (imageError) return { errors: { image: [imageError] } };
    parsed.data.image.stored = stored;

    let saved;
    try {
        saved = await createAlbum({ ...parsed.data, artistId });
    } catch (error) {
        // Prisma messages can leak schema details, so log and return generic copy
        console.error('Failed to create album:', error);
        return { message: 'Could not save this album. Please try again.' };
    }

    return { savedId: saved.id };
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

    // Optional on update: without a new file the current image is kept
    const { stored, error: imageError } = await storeFormImage(formData, {
        folder: 'music/album',
        name: parsed.data.title,
        required: false,
    });
    if (imageError) return { errors: { image: [imageError] } };
    parsed.data.image.stored = stored;

    try {
        await updateAlbum(id, parsed.data);
    } catch (error) {
        console.error('Failed to update album:', error);
        return { message: 'Could not save this album. Please try again.' };
    }

    return { savedId: id };
};
