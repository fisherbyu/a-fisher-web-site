import 'server-only';
import type { Artist, ArtistInput, MusicSort } from '@/types';
import { prisma } from '../clients';
import { transformArtist, artistInclude } from '../data-transformers';
import { toAssetCreate, toAssetUpdate, getImageLocation, deleteOldFiles } from './asset';
import { toGenreCreate, replaceGenres } from './genre';
import { FAVORITE_ARTISTS_SLUG, getRankingOrder, sortByRanking } from './ranking-list';

/**
 * Get Artist Objects from DB
 * @param sort `rank` (default): favorite-artists order, then unranked artists by name. `name`: alphabetical
 */
export const getArtists = async (sort: MusicSort = 'rank'): Promise<Artist[]> => {
    const [data, order] = await Promise.all([
        prisma.artist.findMany({
            include: artistInclude,
            orderBy: { name: 'asc' },
        }),
        sort === 'rank' ? getRankingOrder({ slug: FAVORITE_ARTISTS_SLUG }) : [],
    ]);

    return sortByRanking(data.map(transformArtist), order);
};

/** First artist with this exact name, ignoring case. Names aren't unique, so prefer ids */
export const getArtistByName = async (name: string): Promise<Artist | null> => {
    const artist = await prisma.artist.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        include: artistInclude,
    });

    return artist ? transformArtist(artist) : null;
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
                        create: toAssetCreate(image),
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
 * A new image file replaces the stored columns on the existing Asset row,
 * and the old files are deleted once the save commits.
 *
 * @param {number} id
 * @param {ArtistInput} data
 * @returns {Promise<Artist>}
 */
export async function updateArtist(id: number, data: ArtistInput): Promise<Artist> {
    // Extract Data
    const { name, contents, favoriteTracks, favoriteAlbums, link, image, genres } = data;

    // Only needed when the file is being replaced
    const replaced = image.stored ? await getImageLocation(id) : undefined;

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
                        image: toAssetUpdate(image),
                    },
                },
            },
            include: artistInclude,
        });
    });

    await deleteOldFiles(replaced);

    return transformArtist(artist);
}
