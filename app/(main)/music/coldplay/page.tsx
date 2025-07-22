import type { Metadata } from 'next';

import { PageHeader } from 'thread-ui';
import AlbumContents from './contents';

export default function ArtistPage() {
    return (
        <main>
            <PageHeader title="Coldplay Albums" caption="My review of each Coldplay Album" center />
            <AlbumContents />
        </main>
    );
}

export let metadata: Metadata = {
    title: 'Coldplay Album Reviews',
};
