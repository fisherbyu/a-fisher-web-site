'use client';
import { Divider } from 'thread-ui';
import { ArtistInfoForm } from './artist-info-form';
import { Artist, Attribute, Content, Image, Link } from '@/types';
import { useState } from 'react';
import { FileUpload } from '@/components';

type FormProps = {
    initialData?: Artist;
    onSuccess?: (artist: Artist) => void;
};

export const ArtistForm = ({ initialData, onSuccess }: FormProps) => {
    const [artistInfo, setArtistInfo] = useState({
        name: initialData?.name || '',
        tier: initialData?.tier || 1,
        rank: initialData?.rank || undefined,
    });

    const [link, setLink] = useState<Omit<Link, 'id'>>({
        appleURI: initialData?.link?.appleURI || '',
        spotifyURI: initialData?.link?.spotifyURI || '',
    });

    const [image, setImage] = useState<Omit<Image, 'id'>>({
        src: initialData?.image?.src || '',
        alt: initialData?.image?.alt || '',
        height: initialData?.image?.height || 0,
        width: initialData?.image?.width || 0,
    });

    const [contents, setContents] = useState<Omit<Content, 'id'>[]>(initialData?.contents || [{ order: 1, text: '' }]);

    const [attributes, setAttributes] = useState<Omit<Attribute, 'id'>[]>(
        initialData?.attributes || [{ order: 1, title: '', text: '' }]
    );
    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Artist</div>
            <Divider width="100%" />
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <ArtistInfoForm data={artistInfo} onChange={setArtistInfo} />
                <FileUpload
                    title="Add Image"
                    allowedFileTypes={['image/*']}
                    supportedFormatsText="Supports all Image Types"
                    onFileSelect={() => {}}
                />
            </div>
        </form>
    );
};
