'use client';
import { Button, Divider, TextInput } from 'thread-ui';
import { Playlist } from '@/types';
import { useActionState } from 'react';
import { LinkForm } from './link-form';
import { createPlaylistAction, updatePlaylistAction } from '@/server/data/playlist.actions';

type PlaylistFormProps = {
    /** Existing playlist to edit; omit to create a new one */
    initialData?: Playlist;
};

/**
 * Create/edit form for a Playlist. Submits through a Server Action, so every
 * field is read from the DOM as `FormData` rather than assembled by hand.
 *
 * @example
 * <PlaylistForm />
 *
 * @example
 * <PlaylistForm initialData={playlist} />
 */
export const PlaylistForm = ({ initialData }: PlaylistFormProps) => {
    // Bind the id server-side on edit so it can't be swapped by the client
    const action = initialData
        ? updatePlaylistAction.bind(null, initialData.id)
        : createPlaylistAction;
    const [state, formAction, pending] = useActionState(action, {});

    return (
        <form className="container" action={formAction}>
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Playlist</div>
            <Divider width="100%" />
            {state.message && <div className="text-red-500">{state.message}</div>}
            <div className="w-56">
                <TextInput
                    name="title"
                    title="Title"
                    defaultValue={initialData?.title ?? ''}
                    required
                />
                <LinkForm initialData={initialData?.link} />
                <div className="flex w-full justify-end pt-4">
                    <Button margin="0 0 0 0" type="submit" disabled={pending}>
                        {pending ? 'Saving…' : 'Submit'}
                    </Button>
                </div>
            </div>
        </form>
    );
};
