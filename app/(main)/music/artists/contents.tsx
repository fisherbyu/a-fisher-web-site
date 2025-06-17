'use client';
import MusicDisplay from '@/components/old/ui/music-display';
import { useArtists } from '@/lib/access';

export default function ArtistContents() {
    const { artists, isLoading, error } = useArtists();
    return <div>{artists?.map((artist) => <MusicDisplay key={artist.id} data={artist} type="artist" />)}</div>;
}
