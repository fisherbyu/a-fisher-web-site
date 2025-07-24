'use client';
import { Button, Divider } from 'thread-ui';
import { Link, LinkDto, Playlist, PlaylistDto } from '@/types';
import { useId, useState } from 'react';
import { LinkForm } from './link-form';
import { TextInput } from '@/components/ui';
import { createPlaylist, HandleInputChanges } from '@/lib';

type PlaylistFormProps = {
    initialData?: Playlist;
    onSuccess?: (playlist: Playlist) => void;
};

export const PlaylistForm = ({ initialData, onSuccess }: PlaylistFormProps) => {
    // Extract or Init Data
    const [title, setTitle] = useState(initialData?.title || '');

    const [link, setLink] = useState<Link | LinkDto>(initialData?.link || { id: useId(), appleURI: '', spotifyURI: '' });

    // Handle Submission
    const handleSubmit = async () => {
        // Edit Playlist
        if (initialData) {
            console.log(initialData);
        } else {
            const dto: PlaylistDto = {
                id: crypto.randomUUID(),
                title,
                link,
            };

            try {
                console.log(createPlaylist(dto));
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Playlist</div>
            <Divider width="100%" />
            <div className="w-56">
                <TextInput name="title" title="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <LinkForm data={link} onChange={setLink} />
                <div className="flex w-full justify-end pt-4">
                    <Button margin="0 0 0 0" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};
