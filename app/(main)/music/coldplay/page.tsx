import type { Metadata } from 'next';

import { PageHeader } from 'thread-ui';
import AlbumContents from './contents';

export default function ArtistPage() {
    return (
        <>
            <PageHeader title="Coldplay Albums" caption="My review of each Coldplay Album" center />
            <AlbumContents />
        </>
    );
}

export let metadata: Metadata = {
    title: 'Coldplay Album Reviews',
};
