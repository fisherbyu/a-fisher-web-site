import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { PageHeader } from 'thread-ui';
import { getArtistByName } from '@/server';
import AlbumContents from './contents';

export default async function ArtistPage() {
    // Albums are fetched per artist, so resolve Coldplay's id up front
    const coldplay = await getArtistByName('Coldplay');
    if (!coldplay) notFound();

    return (
        <>
            <PageHeader
                title="Coldplay Albums"
                description="My review of each Coldplay Album"
                center
            />
            <AlbumContents artistId={coldplay.id} />
        </>
    );
}

export let metadata: Metadata = {
    title: 'Coldplay Album Reviews',
};
