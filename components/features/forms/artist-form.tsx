'use client';
import { Divider } from 'thread-ui';
import { ArtistInfoForm } from './artist-info-form';
import { Artist, Attribute, Content, Image, Link } from '@/types';
import { useState } from 'react';
import { FileUpload } from '@/components';
import { LinkForm } from './link-form';
import { ContentData, ContentsForm } from './contents-form';
import { AttributesForm, AttributeData } from './attribute-forms';

type FormProps = {
    initialData?: Artist;
    onSuccess?: (artist: Artist) => void;
};

export const ArtistForm = ({ initialData, onSuccess }: FormProps) => {
    // Handle core Artist Details
    const [artistInfo, setArtistInfo] = useState({
        name: initialData?.name || '',
        tier: initialData?.tier || 1,
        rank: initialData?.rank || undefined,
    });

    // Handle Link Info
    const [link, setLink] = useState<Omit<Link, 'id'>>({
        appleURI: initialData?.link?.appleURI || '',
        spotifyURI: initialData?.link?.spotifyURI || '',
    });

    // Handle Image Data
    const [image, setImage] = useState<Omit<Image, 'id'>>({
        src: initialData?.image?.src || '',
        alt: initialData?.image?.alt || '',
        height: initialData?.image?.height || 0,
        width: initialData?.image?.width || 0,
    });
    const handleFileSelect = async (file: File): Promise<void> => {
        console.log('IMG PROCESS:', file.name);
    };

    // Handle Content Data
    const [contents, setContents] = useState<Content[]>(
        initialData?.contents || [
            { id: 0, order: 1, text: 'Test' },
            { id: 1, order: 2, text: '' },
        ]
    );

    const updateContents = (data: ContentData[]) => {
        const newData = data.map(({ id, ...rest }) => ({
            id: typeof id === 'string' ? parseInt(id, 10) : id,
            ...rest,
        }));

        setContents(newData);
    };

    // Handle Attribute Data
    const [attributes, setAttributes] = useState<Attribute[]>(
        initialData?.attributes || [{ id: 1, order: 1, title: 'Title', text: 'Contents' }]
    );

    const updateAttributes = (data: AttributeData[]) => {
        const newData = data.map(({ id, ...rest }) => ({
            id: typeof id === 'string' ? parseInt(id, 10) : id,
            ...rest,
        }));

        setAttributes(newData);
    };

    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Artist</div>
            <Divider width="100%" />
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div>
                    <ArtistInfoForm data={artistInfo} onChange={setArtistInfo} />
                    <LinkForm data={link} onChange={setLink} />
                </div>
                <div>
                    <AttributesForm data={attributes} onChange={updateAttributes} />
                    <ContentsForm data={contents} onChange={updateContents} />
                </div>
                <FileUpload
                    title="Add Image"
                    allowedFileTypes={['image/*']}
                    supportedFormatsText="Supports all Image Types"
                    onFileSelect={handleFileSelect}
                />
            </div>
        </form>
    );
};
