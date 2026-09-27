'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { Button, ReorderableItemProps, ReorderableList } from 'thread-ui';
import { getAssetSrc, useRefresh } from '@/lib';
import { Asset, Photo } from '@/types';
import { reorderPhotosAction } from '@/server/data/photo.actions';

/** A photo in the arrange grid. `order` is rewritten by the list on reorder */
type Tile = { id: number; title: string; asset: Asset; published: boolean; order: number };

// Tiles render at 128px; 2x for retina
const THUMB_WIDTH = 256;

const toTiles = (photos: Photo[]): Tile[] =>
    photos.map(({ id, title, asset, published }, order) => ({
        id,
        title,
        asset,
        published,
        order,
    }));

// The whole tile is the drag handle
const PhotoTile = ({ item, dragHandleProps, isDragging }: ReorderableItemProps<Tile>) => (
    <div
        {...dragHandleProps}
        title={item.title}
        className={`m-1 w-32 flex flex-col gap-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src={getAssetSrc(item.asset, THUMB_WIDTH)}
            alt={item.asset.alt}
            className={`size-32 rounded-md object-cover pointer-events-none ${
                item.published ? '' : 'opacity-50'
            }`}
        />
        <span className="truncate text-xs">
            {item.order + 1}. {item.title}
            {!item.published && ' (draft)'}
        </span>
    </div>
);

/**
 * Drag photos into their page order. Drafts are included, dimmed, so they keep a spot for
 * when they're published. Reads the same SWR key as the admin list, so both stay in sync.
 *
 * @example
 * <PhotoOrderForm />
 */
export const PhotoOrderForm = () => {
    const { data: photos } = useSWR<Photo[]>('/api/photo?drafts=true');
    const refresh = useRefresh(['/api/photo']);

    // Local order starts from the fetched list; re-seeded when the list itself changes
    const [order, setOrder] = useState<Tile[]>();
    const [seededFrom, setSeededFrom] = useState<Photo[]>();
    if (photos && photos !== seededFrom) {
        setSeededFrom(photos);
        setOrder(toTiles(photos));
    }

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ ok: boolean; text: string }>();

    const save = async (formData: FormData) => {
        setSaving(true);
        setMessage(undefined);
        const result = await reorderPhotosAction(formData);
        setSaving(false);

        setMessage(
            result.ok ? { ok: true, text: 'Order saved' } : { ok: false, text: result.message }
        );
        if (result.ok) refresh();
    };

    if (!order) return <p className="text-gray-500">Loading…</p>;

    return (
        <form className="flex flex-col gap-4 w-full" action={save}>
            {message && (
                <div className={message.ok ? 'text-green-600' : 'text-red-500'}>{message.text}</div>
            )}
            {/* Submits ids as repeated `order` fields, top-left to bottom-right */}
            <ReorderableList
                title="Page Order"
                name="order"
                value={order}
                onChange={setOrder}
                orderProperty="order"
                ItemComponent={PhotoTile}
                getItemLabel={(tile) => tile.title}
                layout="grid"
            />
            <div className="flex flex-row justify-end">
                <Button margin="0px" type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Order'}
                </Button>
            </div>
        </form>
    );
};
