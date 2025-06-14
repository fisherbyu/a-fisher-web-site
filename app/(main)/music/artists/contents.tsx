'use client';
import MusicDisplay from '@/components/old/ui/music-display';
import { getArtists } from '@/lib/';
import { Artist } from '@/types';
import useSWR from 'swr';

const fetcher = async (url: string): Promise<Artist[]> => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Failed to fetch artists');
    }

    return res.json();
};
export default async function ArtistContents() {
    const { data: artists, error } = useSWR('/api/artists', fetcher);
    return <div>{artists?.map((artist) => <MusicDisplay key={artist.id} data={artist} type="artist" />)}</div>;
}
