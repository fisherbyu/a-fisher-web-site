import type { Metadata } from 'next';
import PageTitle from '@/components/old/ui/page-title';
import DisplayPlaylists from '@/components/old/ui/display-playlists';

const title: { title: string; subtitle?: string; center?: boolean } = {
    title: 'My Playlists',
    subtitle: 'Here are some of my favorite playlists',
    center: true,
};

interface Playlist {
    title: string;
    appleURI: string;
    spotifyURI: string;
}

const playlists: Playlist[] = [
    {
        title: 'Autumn Yellow',
        appleURI: 'autumn-yellow/pl.u-NpXmEkVC4YpKoW',
        spotifyURI: '3t7Mg9EtMDpu7730lsvolB',
    },
    {
        title: 'Cooking Up Bops',
        appleURI: 'cooking-up-bops/pl.u-8aAVp8qCvla2z5',
        spotifyURI: '3Lr4DjCEJETTCXBw93hZgm',
    },
    {
        title: 'Spring Violet',
        appleURI: 'spring-violet/pl.u-jV892oDCDGqLxJ',
        spotifyURI: '3xSOnUvh7ixFG7pg8toTJy',
    },
    {
        title: 'Summer Pop',
        appleURI: 'summer-pop/pl.u-kv9l1ZVsJzWZrE',
        spotifyURI: '6Qbl1IHrmDJJzagNdFfMV3',
    },
];

export default function PlaylistPage() {
    return (
        <main>
            <PageTitle components={title} />
            <DisplayPlaylists components={playlists} />
        </main>
    );
}

export let metadata: Metadata = {
    title: 'My Top Playlists',
};
