'use server';
import { Playlist, PlaylistInput } from '@/types';
import { prisma, transformPlaylist } from '@/lib';

/**
 * Server Action to Create Playlist
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
