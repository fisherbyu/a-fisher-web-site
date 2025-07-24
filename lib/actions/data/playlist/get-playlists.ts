'use server';
import { prisma } from '@/lib/prisma';
import { transformPlaylist } from '@/lib';
import { ApiResponse, Playlist } from '@/types';

export const getPlaylists = async (): Promise<Playlist[]> => {
    const data = await prisma.playlist.findMany({
        include: {
            link: true,
        },
    });

    return data.map((playlist) => transformPlaylist(playlist));
};

export const fetchPlaylist = async (): Promise<ApiResponse<Playlist[]>> => {
    try {
        return {
            data: await getPlaylists(),
        };
    } catch (error) {
        return {
            error: 'Failed to fetch Playlists from DB',
            message: error instanceof Error ? error.message : 'Unknown Error fetching playlists',
        };
    }
};
