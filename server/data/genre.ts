import 'server-only';
import type { Prisma } from '@prisma/client';

/**
 * Builds the nested `create` payload for a MusicItem's genre links.
 * Reuses an existing `Genre` when the name matches, otherwise creates it.
 *
 * @example
 * musicItem: { create: { genres: { create: toGenreCreate(genres) } } }
 */
export const toGenreCreate = (
    genres: { name: string }[]
): Prisma.MusicItemGenreCreateWithoutMusicItemInput[] =>
    genres.map(({ name }) => ({
        genre: {
            connectOrCreate: {
                where: { name },
                create: { name },
            },
        },
    }));

/**
 * Replaces every genre link on a MusicItem with the submitted list.
 * Existing links are dropped first so the `[musicItemId, genreId]`
 * composite key can't collide. Orphaned `Genre` rows are left in place.
 *
 * @example
 * await prisma.$transaction(async (tx) => {
 *     await replaceGenres(tx, id, genres);
 *     return tx.artist.update({ ... });
 * });
 */
export const replaceGenres = async (
    tx: Prisma.TransactionClient,
    musicItemId: number,
    genres: { name: string }[]
) => {
    await tx.musicItemGenre.deleteMany({ where: { musicItemId } });

    await tx.musicItem.update({
        where: { id: musicItemId },
        data: {
            genres: {
                create: toGenreCreate(genres),
            },
        },
    });
};
