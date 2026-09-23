import 'server-only';
import type { Album, AlbumInput } from '@/types';
import { prisma } from '../clients';
import { transformAlbum, albumInclude } from '../data-transformers';
import { toGenreCreate, replaceGenres } from './genre';

export const getAlbums = async (): Promise<Album[]> => {
    const data = await prisma.album.findMany({
        include: albumInclude,
    });

    return data.map(transformAlbum);
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
                        create: image,
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
 * Image rows can be shared across MusicItems, so a changed image connects a
 * new row instead of mutating the existing one. The artist relation is fixed
 * at creation and not updatable here.
 *
 * @param {number} id
 * @param {Omit<AlbumInput, 'artistId'>} data
 * @returns {Promise<Album>}
 */
export async function updateAlbum(id: number, data: Omit<AlbumInput, 'artistId'>): Promise<Album> {
    // Extract Data
    const { title, releaseDate, contents, favoriteTracks, link, image, genres } = data;

    // Only touch the image relation when the file actually changed
    const current = await prisma.musicItem.findUnique({
        where: { id },
        select: { image: { select: { src: true } } },
    });
    const imageChanged = current?.image?.src !== image.src;

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
                        ...(imageChanged && {
                            image: {
                                create: image,
                            },
                        }),
                    },
                },
            },
            include: albumInclude,
        });
    });

    return transformAlbum(album);
}
