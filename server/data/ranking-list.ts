import 'server-only';
import { Prisma } from '@prisma/client';
import type { RankingList, RankingListInput } from '@/types';
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
 * Throws unless the entries can live in one list: each item once, and an
 * artist-scoped list only holds that artist's albums.
 */
const assertValidEntries = async (
    tx: Prisma.TransactionClient,
    artistId: number | null | undefined,
    entries: RankingListInput['entries']
) => {
    const musicItemIds = entries.map((entry) => entry.musicItemId);

    if (new Set(musicItemIds).size !== musicItemIds.length) {
        throw new Error('An item can only appear once in a ranking list');
    }

    if (artistId == null) return;

    const matching = await tx.album.count({
        where: { id: { in: musicItemIds }, artistId },
    });

    if (matching !== musicItemIds.length) {
        throw new Error(`Ranking list for artist ${artistId} can only hold that artist's albums`);
    }
};

/**
 * Creates a RankingList and its entries
 * @param {RankingListInput} data
 * @returns {Promise<RankingList>}
 */
export async function createRankingList(data: RankingListInput): Promise<RankingList> {
    // Extract Data
    const { name, slug, artistId, entries } = data;

    const list = await prisma.$transaction(async (tx) => {
        await assertValidEntries(tx, artistId, entries);

        return tx.rankingList.create({
            data: {
                name,
                slug,
                artistId,
                entries: {
                    create: entries.map(({ musicItemId, tier, position }) => ({
                        musicItemId,
                        tier,
                        position,
                    })),
                },
            },
            include: rankingListInclude,
        });
    });

    return transformRankingList(list);
}

/**
 * Updates a RankingList and replaces its entries with the submitted set.
 * The artist scope is fixed at creation and never changes here.
 *
 * Positions are cleared before being rewritten: NULLs never collide, so
 * renumbering can't trip the (listId, tier, position) unique constraint
 * partway through.
 *
 * @param {number} id
 * @param {Omit<RankingListInput, 'artistId'>} data
 * @returns {Promise<RankingList>}
 */
export async function updateRankingList(
    id: number,
    data: Omit<RankingListInput, 'artistId'>
): Promise<RankingList> {
    // Extract Data
    const { name, slug, entries } = data;
    const musicItemIds = entries.map((entry) => entry.musicItemId);

    const list = await prisma.$transaction(async (tx) => {
        const { artistId } = await tx.rankingList.findUniqueOrThrow({
            where: { id },
            select: { artistId: true },
        });

        await assertValidEntries(tx, artistId, entries);

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

        return tx.rankingList.update({
            where: { id },
            data: { name, slug },
            include: rankingListInclude,
        });
    });

    return transformRankingList(list);
}
