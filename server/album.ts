import 'server-only';
import type { Album, AlbumInput } from '@/types';
import { prisma } from './db';
import { transformAlbum, albumInclude } from './data-transformers';

/** Get Album Objects from DB */
export const getAlbums = async (): Promise<Album[]> => {
    const data = await prisma.album.findMany({
        include: albumInclude,
    });

    return data.map(transformAlbum);
};

/**
 * Data Function to Create Album
 * @param {AlbumInput} data
 * @returns {Promise<Album>}
 */
export async function createAlbum(data: AlbumInput): Promise<Album> {
    // Extract Data
    const { title, releaseDate, artistId, contents, favoriteTracks, link, image, genres } = data;

    const album = await prisma.album.create({
        data: {
            title,
            releaseDate,
            contents,
            favoriteTracks,
            // connect (not artistId) so this stays a relation-style create
            artist: {
                connect: { id: artistId },
            },
            // Album's ID comes from its MusicItem; link/image/genres belong to the MusicItem
            musicItem: {
                create: {
                    link: {
                        create: link,
                    },
                    image: {
                        create: image,
                    },
                    genres: {
                        // Reuse the Genre if the name already exists, otherwise create it
                        create: genres.map(({ name }) => ({
                            genre: {
                                connectOrCreate: {
                                    where: { name },
                                    create: { name },
                                },
                            },
                        })),
                    },
                },
            },
        },
        // Return full Album Object
        include: albumInclude,
    });

    return transformAlbum(album);
}
