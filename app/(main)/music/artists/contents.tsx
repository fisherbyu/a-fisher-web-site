'use client';
import MusicDisplay from '@/components/old/ui/music-display';
import { getArtists } from '@/lib/';

export default async function ArtistContents() {
    const artists = await getArtists();
    return (
        <div>
            {artists.map((artist) => (
                <MusicDisplay key={artist.id} data={artist} type="artist" />
            ))}
        </div>
    );
}
