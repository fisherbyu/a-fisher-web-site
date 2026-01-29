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
