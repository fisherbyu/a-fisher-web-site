'use client';
import { Button, TextInput } from 'thread-ui';
import { Playlist } from '@/types';
import { useSaveAction } from '@/lib';
import { LinkForm } from './link-form';
import { createPlaylistAction, updatePlaylistAction } from '@/server/data/playlist.actions';

type PlaylistFormProps = {
    /** Existing playlist to edit; omit to create a new one */
    initialData?: Playlist;
    /** Called with the record's id after a successful save */
    onSaved?: (id: number) => void;
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
export const PlaylistForm = ({ initialData, onSaved }: PlaylistFormProps) => {
    // Bind the id server-side on edit so it can't be swapped by the client
    const action = initialData
        ? updatePlaylistAction.bind(null, initialData.id)
        : createPlaylistAction;
    const [state, formAction, pending] = useSaveAction(action, {
        refresh: ['/api/playlist'],
        onSaved,
    });

    return (
        <form className="flex flex-col gap-4 w-full" action={formAction}>
            {state.message && <div className="text-red-500">{state.message}</div>}
            <div className="w-full max-w-md">
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
