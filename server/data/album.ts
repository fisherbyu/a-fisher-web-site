import 'server-only';
import type { Album, AlbumInput, MusicSort } from '@/types';
import { prisma } from '../clients';
import { transformAlbum, albumInclude } from '../data-transformers';
import { toAssetCreate, toAssetUpdate, getImageLocation, deleteReplacedFiles } from './asset';
import { toGenreCreate, replaceGenres } from './genre';
import { getRankingOrder, sortByRanking } from './ranking-list';

/**
 * Get Albums from DB, all of them or one artist's
 * @param artistId Artist whose albums to return; omit for every album
 * @param sort `rank` (default): the artist's album ranking if one exists, then unranked albums by title. `name`: alphabetical. Without an artist there's no ranking to follow, so both are alphabetical
 */
export const getAlbums = async ({
    artistId,
    sort = 'rank',
}: { artistId?: number; sort?: MusicSort } = {}): Promise<Album[]> => {
    const [data, order] = await Promise.all([
        prisma.album.findMany({
            where: { artistId },
            include: albumInclude,
            orderBy: { title: 'asc' },
        }),
        sort === 'rank' && artistId !== undefined ? getRankingOrder({ artistId }) : [],
    ]);

    return sortByRanking(data.map(transformAlbum), order);
};

export const getAlbum = async (id: number): Promise<Album | null> => {
    const album = await prisma.album.findUnique({
        where: { id },
        include: albumInclude,
    });

    return album ? transformAlbum(album) : null;
};

/**
 * Creates an Album and its MusicItem relations
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
                        create: toAssetCreate(image),
                    },
                    genres: {
                        create: toGenreCreate(genres),
                    },
                },
            },
        },
        // Return full Album Object
        include: albumInclude,
    });

    return transformAlbum(album);
}

/**
 * Updates an Album and its MusicItem relations.
 *
 * A new image file replaces the stored columns on the existing Asset row,
 * and the old files are deleted once the save commits. The artist relation is fixed
 * at creation and not updatable here.
 *
 * @param {number} id
 * @param {Omit<AlbumInput, 'artistId'>} data
 * @returns {Promise<Album>}
 */
export async function updateAlbum(id: number, data: Omit<AlbumInput, 'artistId'>): Promise<Album> {
    // Extract Data
    const { title, releaseDate, contents, favoriteTracks, link, image, genres } = data;

    // Only needed when the file is being replaced
    const replaced = image.stored ? await getImageLocation(id) : undefined;

    const album = await prisma.$transaction(async (tx) => {
        await replaceGenres(tx, id, genres);

        return tx.album.update({
            where: { id },
            data: {
                title,
                releaseDate,
                contents,
                favoriteTracks,
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
            include: albumInclude,
        });
    });

    await deleteReplacedFiles(replaced);

    return transformAlbum(album);
}
