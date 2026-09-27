'use client';
import { useState } from 'react';
import {
    Button,
    Dropdown,
    ReorderableGroup,
    ReorderableGroups,
    ReorderableItemProps,
    ReorderableList,
    TextInput,
} from 'thread-ui';
import { getAssetSrc, useAlbums, useArtists, useRankingList, useSaveAction } from '@/lib';
import { Asset, RankingEntryInput, RankingList, TIER_ORDER, Tier } from '@/types';
import {
    createRankingListAction,
    updateRankingListAction,
} from '@/server/data/ranking-list.actions';

/** A rankable MusicItem. `id` is the MusicItem id; `order` is rewritten by the list on reorder */
type Tile = { id: number; title: string; image?: Asset; order: number };

/** Tier groups use the tier as their id; `POOL` holds what's left unranked */
type TileGroup = ReorderableGroup<Tile> & { id: Tier | typeof POOL };

const POOL = 'pool';

type Style = 'tiered' | 'ordered';

const styleOptions: { label: string; value: Style }[] = [
    { label: 'Tiers (S–C)', value: 'tiered' },
    { label: 'Ordered list', value: 'ordered' },
];

/** Saved entries in their stored order, then every other candidate */
const savedOrder = (candidates: Tile[], list?: RankingList) => {
    const byId = new Map(candidates.map((tile) => [tile.id, tile]));
    const saved = (list?.entries ?? []).flatMap(({ item }) => byId.get(item.id) ?? []);
    const rest = candidates.filter((tile) => !saved.includes(tile));
    return { saved, rest };
};

const numbered = (tiles: Tile[]) => tiles.map((tile, order) => ({ ...tile, order }));

/** Ordered style: every candidate is ranked, saved entries first */
const toOrder = (candidates: Tile[], list?: RankingList): Tile[] => {
    const { saved, rest } = savedOrder(candidates, list);
    return numbered([...saved, ...rest]);
};

/** Tiered style: saved entries in their tiers; everything else starts unranked */
const toGroups = (candidates: Tile[], list?: RankingList): TileGroup[] => {
    const tierOf = new Map(list?.entries.map(({ tier, item }) => [item.id, tier]));
    const { saved, rest } = savedOrder(candidates, list);
    const inTier = (tier: Tier) => saved.filter((tile) => tierOf.get(tile.id) === tier);
    const untiered = saved.filter((tile) => !tierOf.get(tile.id));

    return [
        ...TIER_ORDER.map((tier) => ({ id: tier, title: tier, items: numbered(inTier(tier)) })),
        { id: POOL, title: 'Unranked', items: numbered([...untiered, ...rest]) },
    ];
};

/** Pool items are left out; positions are 1-based within each tier */
const groupsToEntries = (groups: TileGroup[]): RankingEntryInput[] =>
    groups
        .filter(({ id }) => id !== POOL)
        .flatMap(({ id, items }) =>
            items.map((tile, index) => ({
                musicItemId: tile.id,
                tier: id as Tier,
                position: index + 1,
            }))
        );

const orderToEntries = (order: Tile[]): RankingEntryInput[] =>
    order.map((tile, index) => ({ musicItemId: tile.id, position: index + 1 }));

// Largest tile is 64px; 2x for retina
const ARTWORK_WIDTH = 128;

const Artwork = ({ image, className }: Pick<Tile, 'image'> & { className: string }) =>
    image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={getAssetSrc(image, ARTWORK_WIDTH)}
            alt={image.alt}
            className={`${className} rounded-md object-cover pointer-events-none`}
        />
    ) : (
        <div className={`${className} rounded-md bg-gray-200`} />
    );

// Tier table tile; the whole tile is the drag handle
const RankingTile = ({ item, dragHandleProps, isDragging }: ReorderableItemProps<Tile>) => (
    <div
        {...dragHandleProps}
        title={item.title}
        className={`m-1 w-20 flex flex-col items-center gap-1 text-center ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
    >
        <Artwork image={item.image} className="size-16" />
        <span className="w-full truncate text-xs">{item.title}</span>
    </div>
);

// Ordered list row: handle, rank, artwork, title
const RankingRow = ({ item, dragHandle }: ReorderableItemProps<Tile>) => (
    <div className="flex items-center gap-3 py-1">
        {dragHandle}
        <span className="w-6 text-right tabular-nums text-gray-500">{item.order + 1}</span>
        <Artwork image={item.image} className="size-10" />
        <span className="truncate">{item.title}</span>
    </div>
);

type RankingFormFieldsProps = {
    list?: RankingList;
    artistId?: number;
    candidates: Tile[];
    onSaved?: (id: number) => void;
};

const RankingFormFields = ({ list, artistId, candidates, onSaved }: RankingFormFieldsProps) => {
    // Bind server-side so neither the id nor the artist scope can be swapped by the client
    const action = list
        ? updateRankingListAction.bind(null, list.id)
        : createRankingListAction.bind(null, artistId);
    const [state, formAction, pending] = useSaveAction(action, {
        // Artist order follows the favorite-artists ranking
        refresh: ['/api/ranking', '/api/artist'],
        onSaved,
    });

    const [style, setStyle] = useState<Style>(() =>
        list?.entries.length && list.entries.every(({ tier }) => !tier) ? 'ordered' : 'tiered'
    );
    // Each style keeps its own arrangement, so switching back and forth loses nothing
    const [groups, setGroups] = useState(() => toGroups(candidates, list));
    const [order, setOrder] = useState(() => toOrder(candidates, list));
    const entries = style === 'tiered' ? groupsToEntries(groups) : orderToEntries(order);

    return (
        <form className="flex flex-col gap-4 w-full" action={formAction}>
            {state.message && <div className="text-red-500">{state.message}</div>}
            <div className="grid gap-x-10 gap-y-2 grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] max-w-3xl">
                <TextInput
                    name="name"
                    title="Name"
                    defaultValue={list?.name ?? ''}
                    error={state.errors?.name?.[0]}
                    required
                />
                <TextInput
                    name="slug"
                    title="Slug"
                    defaultValue={list?.slug ?? ''}
                    placeholder="coldplay-albums"
                    error={state.errors?.slug?.[0]}
                    required
                />
                <Dropdown
                    title="Style"
                    value={style}
                    options={styleOptions}
                    onChange={(next) => {
                        if (next) setStyle(next);
                    }}
                />
            </div>
            {style === 'tiered' ? (
                <ReorderableGroups
                    title="Ranking"
                    value={groups}
                    onChange={(next) => setGroups(next as TileGroup[])}
                    orderProperty="order"
                    ItemComponent={RankingTile}
                    getItemLabel={(tile) => tile.title}
                    titlePosition="start"
                    sortableGroups={false}
                    layout="grid"
                />
            ) : (
                <div className="max-w-xl">
                    <ReorderableList
                        title="Ranking"
                        value={order}
                        onChange={setOrder}
                        orderProperty="order"
                        ItemComponent={RankingRow}
                        getItemLabel={(tile) => tile.title}
                        layout="vertical"
                    />
                </div>
            )}
            {state.errors?.entries && <div className="text-red-500">{state.errors.entries[0]}</div>}
            {/* The actions read the order as JSON in one field */}
            <input type="hidden" name="entries" value={JSON.stringify(entries)} />
            <div className="flex flex-row justify-end">
                <Button margin="0px" type="submit" disabled={pending}>
                    {pending ? 'Saving…' : 'Submit'}
                </Button>
            </div>
        </form>
    );
};

type RankingFormProps = {
    /** Slug of an existing list to edit; omit to create one */
    slug?: string;
    /** Scopes a new list to this artist's albums; omit for a general list */
    artistId?: number;
    /** Called with the list's id after a successful save */
    onSaved?: (id: number) => void;
};

/**
 * Create/edit form for a RankingList, either as a tier table (S–C plus an unranked pool)
 * or as one straight ordered list. An artist-scoped list ranks that artist's albums;
 * a general list ranks artists.
 *
 * @example
 * <RankingForm slug="coldplay-albums" />
 *
 * @example
 * <RankingForm artistId={coldplay.id} />
 */
export const RankingForm = ({ slug, artistId: newArtistId, onSaved }: RankingFormProps) => {
    const { rankingList, isLoading: listLoading } = useRankingList(slug ?? null);
    // An existing list's scope is only known once it loads
    const artistId = slug ? rankingList?.artistId : newArtistId;
    const { albums, isLoading: albumsLoading } = useAlbums({ artistId: artistId ?? null });
    const { artists, isLoading: artistsLoading } = useArtists();

    // Wait for everything so the groups start from the full picture
    if (listLoading || albumsLoading || artistsLoading) return <div>Loading…</div>;
    if (slug && !rankingList) return <div className="text-red-500">Ranking list not found.</div>;

    // An artist-scoped list ranks that artist's albums; a general list ranks artists
    const candidates: Tile[] =
        artistId === undefined
            ? (artists ?? []).map(({ id, name, image }) => ({ id, title: name, image, order: 0 }))
            : (albums ?? []).map(({ id, title, image }) => ({ id, title, image, order: 0 }));

    return (
        <RankingFormFields
            list={rankingList}
            artistId={artistId}
            candidates={candidates}
            onSaved={onSaved}
        />
    );
};
