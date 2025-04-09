import MusicDisplay from '@/components/old/ui/music-display';
import { getArtists } from '@/lib/actions/artist/get-artists';

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
