import { Playlist } from '@/types';

export type PrismaPlaylist = {
    id: number;
    title: string;
    link: {
        id: number;
        appleURI: string;
        spotifyURI: string;
        createdAt: Date;
        updatedAt: Date;
        artistId: number | null;
        albumId: number | null;
        playlistId: number | null;
    } | null;
};

export const transformPlaylist = (data: PrismaPlaylist): Playlist => {
    return {
        id: data.id,
        title: data.title,
        link: {
            id: data.link!.id,
            appleURI: data.link!.appleURI,
            spotifyURI: data.link!.spotifyURI,
        },
    };
};
