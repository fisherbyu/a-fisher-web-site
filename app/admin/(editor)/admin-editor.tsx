'use client';
import { useState } from 'react';
import { Dropdown } from 'thread-ui';
import {
    AdminNavigator,
    AlbumForm,
    ArtistForm,
    PhotoForm,
    PhotoOrderForm,
    PhotoUploadForm,
    PlaylistForm,
    RankingForm,
    defineAdminSection,
} from '@/components';
import { useArtists } from '@/lib';
import { Album, Artist, Photo, Playlist, RankingListSummary } from '@/types';

// Create flow: an artist scopes the list to their albums; none makes a general list
const CreateRankingForm = ({ onCreated }: { onCreated: (id: number) => void }) => {
    const { artists } = useArtists({ sort: 'name' });
    const [artistId, setArtistId] = useState<number | null>(null);

    const artistOptions = (artists ?? []).map(({ id, name }) => ({ label: name, value: id }));

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full max-w-md">
                <Dropdown
                    title="Artist"
                    placeholder="None (general list)"
                    value={artistId}
                    options={artistOptions}
                    onChange={setArtistId}
                />
            </div>
            <RankingForm
                key={artistId ?? 'general'}
                artistId={artistId ?? undefined}
                onSaved={onCreated}
            />
        </div>
    );
};

/** Every editable admin area, in sidebar order. Add a page at `/admin/<id>` for each */
const sections = [
    defineAdminSection<Artist>({
        id: 'artist',
        title: 'Artists',
        icon: 'MusicNotes',
        // Same key as `useArtists()`, so the two share one cache entry
        endpoint: '/api/artist?sort=rank',
        noun: 'artist',
        getTitle: (artist) => artist.name,
        renderDetail: (artist) => <ArtistForm key={artist.id} initialData={artist} />,
        renderCreate: (onCreated) => <ArtistForm onSaved={onCreated} />,
    }),
    defineAdminSection<Album, Artist>({
        id: 'album',
        title: 'Albums',
        icon: 'VinylRecord',
        // Albums are listed one artist at a time
        scope: {
            title: 'Artist',
            endpoint: '/api/artist?sort=name',
            getOption: (artist: Artist) => ({ label: artist.name, value: artist.id }),
        },
        // Same key as `useAlbums({ artistId })`, so the two share one cache entry
        endpoint: (artistId) => `/api/album?sort=rank&artistId=${artistId}`,
        noun: 'album',
        getTitle: (album) => album.title,
        renderDetail: (album) => (
            <AlbumForm key={album.id} artistId={album.artistId} initialData={album} />
        ),
        renderCreate: (onCreated, artistId) =>
            artistId !== undefined && <AlbumForm artistId={artistId} onSaved={onCreated} />,
    }),
    defineAdminSection<Playlist>({
        id: 'playlist',
        title: 'Playlists',
        icon: 'Playlist',
        endpoint: '/api/playlist',
        noun: 'playlist',
        getTitle: (playlist) => playlist.title,
        renderDetail: (playlist) => <PlaylistForm key={playlist.id} initialData={playlist} />,
        renderCreate: (onCreated) => <PlaylistForm onSaved={onCreated} />,
    }),
    defineAdminSection<Photo>({
        id: 'photo',
        title: 'Photos',
        icon: 'Images',
        // Drafts included; the route requires admin for them
        endpoint: '/api/photo?drafts=true',
        noun: 'photo',
        getTitle: (photo) => (photo.published ? photo.title : `${photo.title} (draft)`),
        renderDetail: (photo, onDeleted) => (
            <PhotoForm key={photo.id} initialData={photo} onDeleted={onDeleted} />
        ),
        renderCreate: (onCreated) => <PhotoUploadForm onCreated={onCreated} />,
        arrange: { title: 'Arrange photos', render: () => <PhotoOrderForm /> },
    }),
    defineAdminSection<RankingListSummary>({
        id: 'ranking',
        title: 'Rankings',
        icon: 'Ranking',
        endpoint: '/api/ranking',
        noun: 'ranking',
        getTitle: (list) => list.name,
        renderDetail: (list) => <RankingForm key={list.id} slug={list.slug} />,
        renderCreate: (onCreated) => <CreateRankingForm onCreated={onCreated} />,
    }),
];

export const AdminEditor = () => <AdminNavigator sections={sections} />;
