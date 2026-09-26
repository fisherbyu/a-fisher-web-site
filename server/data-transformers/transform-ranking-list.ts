import { Prisma } from '@prisma/client';
import { RankedItem, RankingList } from '@/types';
import { transformAlbum } from './transform-album';
import { transformArtist } from './transform-artist';

/** Query shape `transformRankingList` expects. Use this as the `include` in every RankingList query. */
export const rankingListInclude = {
    entries: {
        // Tier sorts by the Postgres enum's declaration order (`S` first)
        orderBy: [
            { tier: { sort: 'asc', nulls: 'last' } },
            { position: { sort: 'asc', nulls: 'last' } },
        ],
        include: {
            musicItem: {
                include: {
                    artist: true,
                    album: true,
                    link: true,
                    image: true,
                    genres: { include: { genre: true } },
                },
            },
        },
    },
} satisfies Prisma.RankingListInclude;

/** A `RankingList` as returned by a query using `rankingListInclude`. */
export type PrismaRankingList = Prisma.RankingListGetPayload<{
    include: typeof rankingListInclude;
}>;

type PrismaEntry = PrismaRankingList['entries'][number];

/** Resolves a MusicItem to its subtype, reshaping it for the subtype's own transform. */
const transformRankedItem = ({ musicItem }: PrismaEntry): RankedItem => {
    const { artist, album, ...item } = musicItem;

    if (artist) return { kind: 'artist', ...transformArtist({ ...artist, musicItem: item }) };
    if (album) return { kind: 'album', ...transformAlbum({ ...album, musicItem: item }) };

    throw new Error(`MusicItem ${musicItem.id} has no Artist or Album`);
};

export const transformRankingList = (data: PrismaRankingList): RankingList => ({
    id: data.id,
    name: data.name,
    slug: data.slug,
    artistId: data.artistId ?? undefined,
    entries: data.entries.map((entry) => ({
        id: entry.id,
        tier: entry.tier ?? undefined,
        position: entry.position ?? undefined,
        item: transformRankedItem(entry),
    })),
});
