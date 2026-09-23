import 'server-only';
import type { Artist, ArtistInput } from '@/types';
import { prisma } from './db';
import { transformArtist, artistInclude } from './data-transformers';

/** Get Artist Objects from DB */
export const getArtists = async (): Promise<Artist[]> => {
    const data = await prisma.artist.findMany({
        include: artistInclude,
    });

    return data.map(transformArtist);
};

/**
 * Data Function Create Artist
 * @param {ArtistInput} data
 * @returns {Promise<Artist>}
 */
export async function createArtist(data: ArtistInput): Promise<Artist> {
    // Extract Data
    const { name, contents, favoriteTracks, favoriteAlbums, link, image, genres } = data;

    // Add to Database
    const artist = await prisma.artist.create({
        data: {
            name,
            contents,
            favoriteTracks,
            favoriteAlbums,
            // Artist's ID comes from its MusicItem; link/image/genres belong to the MusicItem
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
        // Return full Artist Object
        include: artistInclude,
    });

    return transformArtist(artist);
}
