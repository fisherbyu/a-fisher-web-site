import 'server-only';
import type { RankingEntryInput, RankingList } from '@/types';
import { prisma } from '../clients';
import { transformRankingList, rankingListInclude } from '../data-transformers';

/** Ranking list that orders the artist endpoint. */
export const FAVORITE_ARTISTS_SLUG = 'favorite-artists';

/** Get RankingList Objects from DB */
export const getRankingLists = async (): Promise<RankingList[]> => {
    const data = await prisma.rankingList.findMany({
        include: rankingListInclude,
    });

    return data.map(transformRankingList);
};

export const getRankingList = async (id: number): Promise<RankingList | null> => {
    const list = await prisma.rankingList.findUnique({
        where: { id },
        include: rankingListInclude,
    });

    return list ? transformRankingList(list) : null;
};

/** `slug` is uniquely indexed, so named lists (e.g. `FAVORITE_ARTISTS_SLUG`) can be looked up directly */
export const getRankingListBySlug = async (slug: string): Promise<RankingList | null> => {
    const list = await prisma.rankingList.findUnique({
        where: { slug },
        include: rankingListInclude,
    });

    return list ? transformRankingList(list) : null;
};

/**
 * Replaces a RankingList's entries with the submitted set.
 *
 * Positions are cleared before being rewritten: NULLs never collide, so
 * renumbering can't trip the (listId, tier, position) unique constraint
 * partway through.
 *
 * @param {number} id
 * @param {RankingEntryInput[]} entries
 * @returns {Promise<RankingList>}
 */
export async function updateRankingList(
    id: number,
    entries: RankingEntryInput[]
): Promise<RankingList> {
    const musicItemIds = entries.map((entry) => entry.musicItemId);

    if (new Set(musicItemIds).size !== musicItemIds.length) {
        throw new Error('An item can only appear once in a ranking list');
    }

    const list = await prisma.$transaction(async (tx) => {
        // An artist-scoped list may only rank that artist's albums
        const { artistId } = await tx.rankingList.findUniqueOrThrow({
            where: { id },
            select: { artistId: true },
        });

        if (artistId !== null) {
            const matching = await tx.album.count({
                where: { id: { in: musicItemIds }, artistId },
            });

            if (matching !== musicItemIds.length) {
                throw new Error(`RankingList ${id} only accepts albums by artist ${artistId}`);
            }
        }

        // Drop entries no longer in the list
        await tx.rankingEntry.deleteMany({
            where: { listId: id, musicItemId: { notIn: musicItemIds } },
        });

        await tx.rankingEntry.updateMany({
            where: { listId: id },
            data: { position: null },
        });

        // ?? null (not undefined) so clearing a tier or position actually clears it
        for (const { musicItemId, tier, position } of entries) {
            await tx.rankingEntry.upsert({
                where: { list_item: { listId: id, musicItemId } },
                create: { listId: id, musicItemId, tier: tier ?? null, position: position ?? null },
                update: { tier: tier ?? null, position: position ?? null },
            });
        }

        return tx.rankingList.findUniqueOrThrow({
            where: { id },
            include: rankingListInclude,
        });
    });

    return transformRankingList(list);
}
