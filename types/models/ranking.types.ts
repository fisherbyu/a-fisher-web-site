import type { Album, Artist, Input } from '@/types';
import type { Prettify } from 'thread-ui';

/** Tier labels, ordered best-first. Mirrors the Prisma `Tier` enum. */
export type Tier = 'S' | 'A' | 'B' | 'C';

/** Tier labels in sort order. Keep in sync with the Prisma `Tier` enum. */
export const TIER_ORDER: Tier[] = ['S', 'A', 'B', 'C'];

/**
 * Orderings for music list routes (`?sort=`): `rank` follows the relevant RankingList,
 * then unranked items by name; `name` is alphabetical.
 */
export const MUSIC_SORTS = ['rank', 'name'] as const;
export type MusicSort = (typeof MUSIC_SORTS)[number];

/** A ranked `MusicItem`, discriminated by which subtype it resolved to. */
export type RankedItem = ({ kind: 'artist' } & Artist) | ({ kind: 'album' } & Album);

/** One item's placement in one `RankingList`. */
export type RankingEntry = {
    id: number;
    /** Section the item sits in. Absent on untiered lists. */
    tier?: Tier;
    /** Order within the tier. Absent when the tier is unranked. */
    position?: number;
    item: RankedItem;
};

export type RankingList = Prettify<{
    id: number;
    name: string;
    slug: string;
    /** Set when the list is scoped to one artist's albums. */
    artistId?: number;
    /** Ordered by tier, then position. */
    entries: RankingEntry[];
}>;

/** A RankingList without its entries, as listed by the index route. */
export type RankingListSummary = Omit<RankingList, 'entries'>;

/** One entry as submitted by the ranking form. */
export type RankingEntryInput = {
    musicItemId: number;
    tier?: Tier;
    position?: number;
};

/** A RankingList as submitted by the ranking form. `artistId` is fixed once created. */
export type RankingListInput = Prettify<
    Omit<Input<RankingList>, 'entries'> & {
        entries: RankingEntryInput[];
    }
>;
