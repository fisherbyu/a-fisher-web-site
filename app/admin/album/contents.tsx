'use client';
import { AlbumForm, BookDisplay } from '@/components';
import { useAlbums } from '@/lib';
import { Album } from '@/types';

const EditAlbumForm = ({ data }: { data: Album }) => {
    return <AlbumForm key={data.id} initialData={data} />;
};

export default function AlbumContents() {
    const { albums, isLoading, error } = useAlbums();

    const displayArtistListItem = (item: Album) => (
        <div>
            <div className="font-medium">{item.name}</div>
        </div>
    );

    return (
        <BookDisplay<Album>
            items={albums ?? []}
            renderListItem={displayArtistListItem}
            renderDetail={(album) => <EditAlbumForm data={album} />}
            listTitle="Albums"
            defaultPage={<AlbumForm />}
        />
    );
}
