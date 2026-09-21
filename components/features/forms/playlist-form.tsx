'use client';
import { Button, Divider } from 'thread-ui';
import { Playlist, PlaylistInput } from '@/types';
import { useState } from 'react';
import { LinkData, LinkForm } from './link-form';
import { TextInput } from 'thread-ui';
import { createPlaylist } from '@/lib';

type PlaylistFormProps = {
    initialData?: Playlist;
    onSuccess?: (playlist: Playlist) => void;
};

export const PlaylistForm = ({ initialData, onSuccess }: PlaylistFormProps) => {
    // Extract or Init Data
    const [title, setTitle] = useState(initialData?.title ?? '');

    const [link, setLink] = useState<LinkData>({
        appleURI: initialData?.link?.appleURI ?? '',
        spotifyURI: initialData?.link?.spotifyURI ?? '',
    });

    // Handle Submission
    const handleSubmit = async () => {
        // Edit Playlist
        if (initialData) {
            console.log(initialData);
            return;
        }

        // Create Playlist
        const input: PlaylistInput = {
            title,
            link,
        };

        try {
            const playlist = await createPlaylist(input);
            onSuccess?.(playlist);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Playlist</div>
            <Divider width="100%" />
            <div className="w-56">
                <TextInput
                    name="title"
                    title="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
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
