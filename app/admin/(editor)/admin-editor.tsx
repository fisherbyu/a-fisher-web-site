'use client';
import { useState } from 'react';
import { Dropdown } from 'thread-ui';
import {
    AdminNavigator,
    AlbumForm,
    ArtistForm,
    PlaylistForm,
    defineAdminSection,
} from '@/components';
import { useArtists } from '@/lib';
import { Album, Artist, Playlist } from '@/types';

// Create flow: pick the Artist first, since every Album belongs to one
const CreateAlbumForm = () => {
    const { artists } = useArtists();
    const [artistId, setArtistId] = useState<number | null>(null);

    const artistOptions = (artists ?? []).map(({ id, name }) => ({ label: name, value: id }));

    return (
        <div>
            <Dropdown
                title="Artist"
                value={artistId}
                options={artistOptions}
                onChange={setArtistId}
            />
            {artistId !== null && <AlbumForm key={artistId} artistId={artistId} />}
        </div>
    );
};

/** Every editable admin area, in sidebar order. Add a page at `/admin/<id>` for each */
const sections = [
    defineAdminSection<Artist>({
        id: 'artist',
        title: 'Artists',
        icon: 'MusicNotes',
        endpoint: '/api/artist',
        noun: 'artist',
        getTitle: (artist) => artist.name,
        renderDetail: (artist) => <ArtistForm key={artist.id} initialData={artist} />,
        renderCreate: () => <ArtistForm />,
    }),
    defineAdminSection<Album>({
        id: 'album',
        title: 'Albums',
        icon: 'VinylRecord',
        endpoint: '/api/album',
        noun: 'album',
        getTitle: (album) => album.title,
        renderDetail: (album) => (
            <AlbumForm key={album.id} artistId={album.artistId} initialData={album} />
        ),
        renderCreate: () => <CreateAlbumForm />,
    }),
    defineAdminSection<Playlist>({
        id: 'playlist',
        title: 'Playlists',
        icon: 'Playlist',
        endpoint: '/api/playlist',
        noun: 'playlist',
        getTitle: (playlist) => playlist.title,
        renderDetail: (playlist) => <PlaylistForm key={playlist.id} initialData={playlist} />,
        renderCreate: () => <PlaylistForm />,
    }),
];

export const AdminEditor = () => <AdminNavigator sections={sections} />;
