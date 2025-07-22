'use client';
import { MusicCard } from '@/components';
import { useArtists } from '@/lib';

export default function ArtistContents() {
    const { artists, isLoading, error } = useArtists();
    return <div>{artists?.map((artist, _) => <MusicCard key={_} index={_} item={artist} type="artist" />)}</div>;
}
