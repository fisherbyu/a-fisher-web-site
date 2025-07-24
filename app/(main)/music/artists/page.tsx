import type { Metadata } from 'next';

import ArtistContents from './contents';
import { PageHeader } from 'thread-ui';

export default function ArtistPage() {
    return (
        <>
            <PageHeader title="My Favorite Artists" caption="Check out some of my Favorite Artists" center />
            <ArtistContents />
        </>
    );
}

export let metadata: Metadata = {
    title: 'My Favorite Artists',
};
