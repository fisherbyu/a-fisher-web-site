import type { Metadata } from 'next';
import { PageHeader } from 'thread-ui';
import { PlaylistContents } from './content';

export default function PlaylistPage() {
    return (
        <main>
            <PageHeader title="My Playlists" caption="Here are some of my favorite playlists" center />
            <PlaylistContents />
        </main>
    );
}

export let metadata: Metadata = {
    title: 'My Playlists',
};
