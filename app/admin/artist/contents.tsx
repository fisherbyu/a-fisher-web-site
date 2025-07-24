'use client';
import { ArtistForm, BookDisplay } from '@/components';
import { getArtists, useArtists } from '@/lib';
import { Artist } from '@/types';
import { useEffect, useState } from 'react';

const EditArtistForm = ({ data }: { data: Artist }) => {
    return <ArtistForm key={data.id} initialData={data} />;
};

export default function ArtistContents() {
    const { artists, isLoading, error } = useArtists();
    const [loading, setLoading] = useState(true);

    const displayArtistListItem = (item: Artist) => (
        <div>
            <div className="font-medium">{item.name}</div>
        </div>
    );

    return (
        <BookDisplay<Artist>
            items={artists ?? []}
            renderListItem={displayArtistListItem}
            renderDetail={(artist) => <EditArtistForm data={artist} />}
            listTitle="Artists"
            defaultPage={<ArtistForm />}
        />
    );
}
