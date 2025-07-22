'use client';
import { AlbumForm, BookDisplay } from '@/components';
import { fetchAlbums, getAlbums } from '@/lib';
import { Album } from '@/types';
import { useEffect, useState } from 'react';

const EditAlbumForm = ({ data }: { data: Album }) => {
    return <AlbumForm key={data.id} initialData={data} />;
};

export default function AlbumContents() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArtists() {
            try {
                const data = await getAlbums();
                setAlbums(data);
            } catch (error) {
                console.error('Failed to fetch albums:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAlbums();
    }, []);

    const displayArtistListItem = (item: Album) => (
        <div>
            <div className="font-medium">{item.name}</div>
        </div>
    );

    return (
        <BookDisplay<Album>
            items={albums}
            renderListItem={displayArtistListItem}
            renderDetail={(album) => <EditAlbumForm data={album} />}
            listTitle="Albums"
            defaultPage={<AlbumForm />}
        />
    );
}
