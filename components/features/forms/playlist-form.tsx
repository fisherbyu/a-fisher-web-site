'use client';
import { Divider } from 'thread-ui';
import { Link, LinkDto, Playlist } from '@/types';
import { useId, useState } from 'react';
import { LinkForm } from './link-form';

type PlaylistFormProps = {
    initialData?: Playlist;
    onSuccess?: (playlist: Playlist) => void;
};

export const PlaylistForm = ({ initialData, onSuccess }: PlaylistFormProps) => {
    // Extract or Init Data
    const [title, setTitle] = useState(initialData?.title || '');

    const [link, setLink] = useState<Link | LinkDto>(initialData?.link || { id: useId(), appleURI: '', spotifyURI: '' });

    // Handle Submission

    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Artist</div>
            <Divider width="100%" />
            <div className="flex flex-row items-center justify-center">
                <LinkForm data={link} onChange={setLink} />
            </div>
        </form>
    );
};
