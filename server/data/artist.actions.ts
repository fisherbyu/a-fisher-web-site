'use server';
import { z } from 'zod';
import { ArtistInput } from '@/types';
import { requireAdmin } from '../auth';
import { createArtist, updateArtist } from './artist';
import { formatZodList } from '@/lib';
import { storeFormImage } from '@/server/media';

/** Shape returned to `useActionState`; `errors` is keyed by form field name */
export type ArtistFormState = {
    /** Field-level validation messages */
    errors?: Record<string, string[]>;
    /** Top-level failure message, shown above the form */
    message?: string;
    /** Id of the record just saved; set only on success */
    savedId?: number;
};

/** Field lengths mirror the `VarChar` limits in the Prisma schema */
const artistSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    contents: z
        .array(z.string())
        .transform((texts) => texts.map((text) => text.trim()).filter(Boolean)),
    favoriteTracks: formatZodList(255),
    favoriteAlbums: formatZodList(255),
    appleURI: z.string().trim().max(255).default(''),
    spotifyURI: z.string().trim().max(255).default(''),
    imageAlt: z.string().trim().max(255).default(''),
    // `Genre.name` is uniquely indexed, so dedupe before the write
    genres: formatZodList(50).transform((names) => [...new Set(names)]),
});

type ParseResult =
    | { success: true; data: ArtistInput }
    | { success: false; state: ArtistFormState };

/** Reads the artist form fields and reshapes them into an `ArtistInput` */
const parseArtistForm = (formData: FormData): ParseResult => {
    const parsed = artistSchema.safeParse({
        name: formData.get('name'),
        contents: formData.getAll('contents'),
        favoriteTracks: formData.get('favoriteTracks'),
        favoriteAlbums: formData.get('favoriteAlbums'),
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
 * Creates an Artist from form data. The image file rides along in the form
 * data and is processed into MEDIA_ROOT before the row is saved.
 *
 * @example
 * const [state, formAction, pending] = useActionState(createArtistAction, {});
 */
export const createArtistAction = async (
    prevState: ArtistFormState,
    formData: FormData
): Promise<ArtistFormState> => {
    await requireAdmin();

    const parsed = parseArtistForm(formData);
    if (!parsed.success) return parsed.state;

    const { stored, error: imageError } = await storeFormImage(formData, {
        folder: 'music/artist',
        name: parsed.data.name,
        required: true,
    });
    if (imageError) return { errors: { image: [imageError] } };
    parsed.data.image.stored = stored;

    let saved;
    try {
        saved = await createArtist(parsed.data);
    } catch (error) {
        // Prisma messages can leak schema details, so log and return generic copy
        console.error('Failed to create artist:', error);
        return { message: 'Could not save this artist. Please try again.' };
    }

    return { savedId: saved.id };
};

/**
 * Updates an existing Artist. `id` is bound server-side rather than read from
 * the form, so it can't be swapped by the client.
 *
 * @example
 * const action = updateArtistAction.bind(null, artist.id);
 * const [state, formAction, pending] = useActionState(action, {});
 */
export const updateArtistAction = async (
    id: number,
    prevState: ArtistFormState,
    formData: FormData
): Promise<ArtistFormState> => {
    await requireAdmin();

    const parsed = parseArtistForm(formData);
    if (!parsed.success) return parsed.state;

    // Optional on update: without a new file the current image is kept
    const { stored, error: imageError } = await storeFormImage(formData, {
        folder: 'music/artist',
        name: parsed.data.name,
        required: false,
    });
    if (imageError) return { errors: { image: [imageError] } };
    parsed.data.image.stored = stored;

    try {
        await updateArtist(id, parsed.data);
    } catch (error) {
        console.error('Failed to update artist:', error);
        return { message: 'Could not save this artist. Please try again.' };
    }

    return { savedId: id };
};
