'use client';
import { ArtistForm, BookDisplay } from '@/components';
import { getArtists } from '@/lib';
import { Artist } from '@/types';
import { useEffect, useState } from 'react';

const EditArtistForm = ({ data }: { data: Artist }) => {
    return <ArtistForm key={data.id} initialData={data} />;
};

export default function ArtistContents() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArtists() {
            try {
                const data = await getArtists();
                setArtists(data);
            } catch (error) {
                console.error('Failed to fetch artists:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchArtists();
    }, []);

    const displayArtistListItem = (item: Artist) => (
        <div>
            <div className="font-medium">{item.name}</div>
        </div>
    );

    return (
        <BookDisplay<Artist>
            items={artists}
            renderListItem={displayArtistListItem}
            renderDetail={(artist) => <EditArtistForm data={artist} />}
            listTitle="Artists"
        />
    );
}
