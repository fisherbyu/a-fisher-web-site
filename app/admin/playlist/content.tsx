'use client';
import { BookDisplay, PlaylistForm } from '@/components';
import { usePlaylists } from '@/lib';
import { Playlist } from '@/types';

const EditPlaylistForm = ({ data }: { data: Playlist }) => {
    return <PlaylistForm key={data.id} initialData={data} />;
};

export default function PlaylistContent() {
    const { playlists, isLoading, error } = usePlaylists();

    const displayPlaylistListItem = (item: Playlist) => (
        <div>
            <div className="font-medium">{item.title}</div>
        </div>
    );
    return (
        <BookDisplay
            items={playlists ?? []}
            renderListItem={displayPlaylistListItem}
            renderDetail={(playlists) => <EditPlaylistForm data={playlists} />}
            listTitle="Playlists"
            defaultPage={<PlaylistForm />}
        />
    );
}
