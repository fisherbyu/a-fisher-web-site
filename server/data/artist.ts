import 'server-only';
import type { Artist, ArtistInput } from '@/types';
import { prisma } from '../clients';
import { transformArtist, artistInclude } from '../data-transformers';
import { toGenreCreate, replaceGenres } from './genre';

/** Get Artist Objects from DB */
export const getArtists = async (): Promise<Artist[]> => {
    const data = await prisma.artist.findMany({
        include: artistInclude,
    });

    return data.map(transformArtist);
};

export const getArtist = async (id: number): Promise<Artist | null> => {
    const artist = await prisma.artist.findUnique({
        where: { id },
        include: artistInclude,
    });

    return artist ? transformArtist(artist) : null;
};

/**
 * Pulls a single random artist without loading the whole table.
 * Counts rows, then skips to a random offset. Built for Health Endpoint
 */
export const getRandomArtist = async (): Promise<Artist | null> => {
    const total = await prisma.artist.count();
    if (total === 0) return null;

    const artist = await prisma.artist.findFirst({
        skip: Math.floor(Math.random() * total),
        include: artistInclude,
    });

    return artist ? transformArtist(artist) : null;
};

/**
 * Creates an Artist and its MusicItem relations
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
                        create: toGenreCreate(genres),
                    },
                },
            },
        },
        // Return full Artist Object
        include: artistInclude,
    });

    return transformArtist(artist);
}

/**
 * Updates an Artist and its MusicItem relations.
 *
 * Image rows can be shared across MusicItems, so a changed image connects a
 * new row instead of mutating the existing one.
 *
 * @param {number} id
 * @param {ArtistInput} data
 * @returns {Promise<Artist>}
 */
export async function updateArtist(id: number, data: ArtistInput): Promise<Artist> {
    // Extract Data
    const { name, contents, favoriteTracks, favoriteAlbums, link, image, genres } = data;

    // Only touch the image relation when the file actually changed
    const current = await prisma.musicItem.findUnique({
        where: { id },
        select: { image: { select: { src: true } } },
    });
    const imageChanged = current?.image?.src !== image.src;

    const artist = await prisma.$transaction(async (tx) => {
        await replaceGenres(tx, id, genres);

        return tx.artist.update({
            where: { id },
            data: {
                name,
                contents,
                favoriteTracks,
                favoriteAlbums,
                musicItem: {
                    update: {
                        // Relations are nullable, so upsert rather than update
                        link: {
                            upsert: {
                                create: link,
                                update: link,
                            },
                        },
                        ...(imageChanged && {
                            image: {
                                create: image,
                            },
                        }),
                    },
                },
            },
            include: artistInclude,
        });
    });

    return transformArtist(artist);
}
