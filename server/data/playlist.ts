import 'server-only';
import type { Playlist, PlaylistInput } from '@/types';
import { prisma } from '../clients';
import { transformPlaylist, playlistInclude } from '../data-transformers';

export const getPlaylists = async (): Promise<Playlist[]> => {
    const data = await prisma.playlist.findMany({
        include: playlistInclude,
    });

    return data.map(transformPlaylist);
};

export const getPlaylist = async (id: number): Promise<Playlist | null> => {
    const playlist = await prisma.playlist.findUnique({
        where: { id },
        include: playlistInclude,
    });

    return playlist ? transformPlaylist(playlist) : null;
};

/**
 * Creates a Playlist and its Link
 * @param {PlaylistInput} data
 * @returns {Promise<Playlist>}
 */
export async function createPlaylist(data: PlaylistInput): Promise<Playlist> {
    // Extract Data
    const { title, link } = data;

    const playlist = await prisma.playlist.create({
        data: {
            title,
            // Link is optional on Playlist, so only attach it when provided
            ...(link && {
                link: {
                    create: link,
                },
            }),
        },
        include: playlistInclude,
    });

    return transformPlaylist(playlist);
}

/**
 * Updates a Playlist and its Link.
 * The Link relation is nullable, so it upserts rather than updates.
 *
 * @param {number} id
 * @param {PlaylistInput} data
 * @returns {Promise<Playlist>}
 */
export async function updatePlaylist(id: number, data: PlaylistInput): Promise<Playlist> {
    // Extract Data
    const { title, link } = data;

    const playlist = await prisma.playlist.update({
        where: { id },
        data: {
            title,
            ...(link && {
                link: {
                    upsert: {
                        create: link,
                        update: link,
                    },
                },
            }),
        },
        include: playlistInclude,
    });

    return transformPlaylist(playlist);
}
