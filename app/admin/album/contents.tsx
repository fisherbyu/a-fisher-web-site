'use client';
import { useState } from 'react';
import { AlbumForm, BookDisplay } from '@/components';
import { useAlbums, useArtists } from '@/lib';
import { Dropdown } from 'thread-ui';
import { Album } from '@/types';

const EditAlbumForm = ({ data }: { data: Album }) => {
    return <AlbumForm key={data.id} artistId={data.artistId} initialData={data} />;
};

// Create flow: pick the Artist first, since every Album belongs to one
const CreateAlbumForm = () => {
    const { artists } = useArtists();
    const [artistId, setArtistId] = useState<number>();

    const artistOptions = (artists ?? []).map(({ id, name }) => ({ label: name, value: id }));

    return (
        <div>
            <Dropdown
                value={artistId}
                options={artistOptions}
                onSelect={(value) => setArtistId(Number(value))}
            />
            {artistId !== undefined && <AlbumForm key={artistId} artistId={artistId} />}
        </div>
    );
};

export default function AlbumContents() {
    const { albums, isLoading, error } = useAlbums();

    const displayArtistListItem = (item: Album) => (
        <div>
            <div className="font-medium">{item.title}</div>
        </div>
    );

    return (
        <BookDisplay<Album>
            items={albums ?? []}
            renderListItem={displayArtistListItem}
            renderDetail={(album) => <EditAlbumForm data={album} />}
            listTitle="Albums"
            defaultPage={<CreateAlbumForm />}
        />
    );
}
