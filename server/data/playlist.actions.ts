'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PlaylistInput } from '@/types';
import { requireAdmin } from '../auth';
import { createPlaylist, updatePlaylist } from './playlist';

/** Shape returned to `useActionState`; `errors` is keyed by form field name */
export type PlaylistFormState = {
    /** Field-level validation messages */
    errors?: Record<string, string[]>;
    /** Top-level failure message, shown above the form */
    message?: string;
};

/** Field lengths mirror the `VarChar` limits in the Prisma schema */
const playlistSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100),
    appleURI: z.string().trim().max(255).default(''),
    spotifyURI: z.string().trim().max(255).default(''),
});

type ParseResult =
    | { success: true; data: PlaylistInput }
    | { success: false; state: PlaylistFormState };

/** Reads the playlist form fields and reshapes them into a `PlaylistInput` */
const parsePlaylistForm = (formData: FormData): ParseResult => {
    const parsed = playlistSchema.safeParse({
        title: formData.get('title'),
        appleURI: formData.get('appleURI'),
        spotifyURI: formData.get('spotifyURI'),
    });

    if (!parsed.success) {
        return { success: false, state: { errors: z.flattenError(parsed.error).fieldErrors } };
    }

    const { title, appleURI, spotifyURI } = parsed.data;

    return {
        success: true,
        data: {
            title,
            link: { appleURI, spotifyURI },
        },
    };
};

/**
 * Creates a Playlist.
 *
 * @example
 * const [state, formAction, pending] = useActionState(createPlaylistAction, {});
 */
export const createPlaylistAction = async (
    prevState: PlaylistFormState,
    formData: FormData
): Promise<PlaylistFormState> => {
    await requireAdmin();

    const parsed = parsePlaylistForm(formData);
    if (!parsed.success) return parsed.state;

    try {
        await createPlaylist(parsed.data);
    } catch (error) {
        // Prisma messages can leak schema details, so log and return generic copy
        console.error('Failed to create playlist:', error);
        return { message: 'Could not save this playlist. Please try again.' };
    }

    revalidatePath('/admin/playlists');
    redirect('/admin/playlists');
};

/**
 * Updates an existing Playlist. `id` is bound server-side rather than read
 * from the form, so it can't be swapped by the client.
 *
 * @example
 * const action = updatePlaylistAction.bind(null, playlist.id);
 * const [state, formAction, pending] = useActionState(action, {});
 */
export const updatePlaylistAction = async (
    id: number,
    prevState: PlaylistFormState,
    formData: FormData
): Promise<PlaylistFormState> => {
    await requireAdmin();

    const parsed = parsePlaylistForm(formData);
    if (!parsed.success) return parsed.state;

    try {
        await updatePlaylist(id, parsed.data);
    } catch (error) {
        console.error('Failed to update playlist:', error);
        return { message: 'Could not save this playlist. Please try again.' };
    }

    revalidatePath('/admin/playlists');
    redirect('/admin/playlists');
};
