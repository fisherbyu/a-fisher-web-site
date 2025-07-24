'use server';
import { Playlist, PlaylistDto } from '@/types';
import { prisma, transformPlaylist } from '@/lib';

/**
 * Server Action to Create Playlist
 * @param {PlaylistDto} data
 * @returns {Promise<Playlist>}
 */
export async function createPlaylist(data: PlaylistDto): Promise<Playlist> {
    // Extract Data
    const {
        title,
        link: { id: linkId, ...linkData },
    } = data;

    const playlist = await prisma.playlist.create({
        data: {
            title,
            link: {
                create: linkData,
            },
        },
        include: {
            link: true,
        },
    });

    return transformPlaylist(playlist);
}
