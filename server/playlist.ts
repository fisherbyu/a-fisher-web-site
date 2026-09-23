import 'server-only';
import type { Playlist, PlaylistInput } from '@/types';
import { prisma } from './db';
import { transformPlaylist } from '@/lib';

/** Get Playlist Objects from DB */
export const getPlaylists = async (): Promise<Playlist[]> => {
    const data = await prisma.playlist.findMany({
        include: {
            link: true,
        },
    });

    return data.map(transformPlaylist);
};

/**
 * Data Function to Create Playlist
 * @param {PlaylistInput} data
 * @returns {Promise<Playlist>}
 */
export async function createPlaylist(data: PlaylistInput): Promise<Playlist> {
    // Extract Data
    const { title, link } = data;

    const playlist = await prisma.playlist.create({
        data: {
            title,
            link: {
                create: link,
            },
        },
        include: {
            link: true,
        },
    });

    return transformPlaylist(playlist);
}
