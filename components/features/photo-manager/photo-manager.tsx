'use client';
import { ReactNode } from 'react';
import { Button, IconButton, Modal, ReorderableItemProps, ReorderableList } from 'thread-ui';
import { getAssetSrc } from '@/lib';
import { LoadingError } from '@/components/ui/loading-error';
import { PhotoForm, PhotoUploadForm } from '../forms';
import { PhotoTile, usePhotoManager } from './photo-manager-context';

// Every tile shares a height; width follows the photo's aspect ratio
const TILE_HEIGHT = 160;

/** Photo on the left is the drag handle; the strip on the right holds its position and edit button */
const PhotoTileItem = ({ item, dragHandleProps, isDragging }: ReorderableItemProps<PhotoTile>) => {
    const { edit } = usePhotoManager();
    const width = Math.round((TILE_HEIGHT * item.asset.width) / item.asset.height);

    return (
        <div
            className="group m-1 flex rounded-md border border-gray-200"
            style={{ height: TILE_HEIGHT }}
        >
            <div
                {...dragHandleProps}
                className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                style={{ width, height: TILE_HEIGHT }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={getAssetSrc(item.asset, width * 2)}
                    alt={item.asset.alt}
                    className={`size-full rounded-l-md object-cover pointer-events-none ${
                        item.published ? '' : 'opacity-50'
                    }`}
                />
            </div>
            <div className="w-10 flex flex-col items-center justify-between py-2 text-xs text-gray-500">
                <span className="tabular-nums">{item.order + 1}</span>
                {/* Hidden until hover, but still reachable by keyboard */}
                <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                    <IconButton
                        name="PencilSimple"
                        color="neutral"
                        text
                        size="sm"
                        ariaLabel={`Edit ${item.title}`}
                        onClick={() => edit(item.id)}
                    />
                </div>
                <span className="[writing-mode:vertical-rl] rotate-180">
                    {item.published ? '' : 'Draft'}
                </span>
            </div>
        </div>
    );
};

const TilesWrapper = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-wrap">{children}</div>
);

/**
 * Admin Photos view: every photo, drafts dimmed, in page order. Drag photos to reorder
 * (saved from `PhotoOrderFooter`), and edit one in a modal from its tile.
 *
 * @example
 * defineStandaloneSection({ id: 'photo', title: 'Photos', render: () => <PhotoManager /> })
 */
export const PhotoManager = () => {
    const { photos, isLoading, error, order, setOrder, editing, edit, uploadOpen, setUploadOpen } =
        usePhotoManager();

    if (error) return <LoadingError />;
    if (isLoading || !photos) return <p className="text-gray-500">Loading…</p>;

    return (
        <>
            {order.length ? (
                <ReorderableList
                    title="Page Order"
                    value={order}
                    onChange={setOrder}
                    orderProperty="order"
                    ItemComponent={PhotoTileItem}
                    getItemLabel={(tile) => tile.title}
                    layout="grid"
                    ItemsWrapper={TilesWrapper}
                />
            ) : (
                <p className="text-gray-500">No photos yet. Upload some to get started.</p>
            )}
            <Modal
                isOpen={Boolean(editing)}
                onClose={() => edit(null)}
                title={editing?.title}
                size="lg"
            >
                {editing && (
                    <PhotoForm
                        key={editing.id}
                        initialData={editing}
                        onSaved={() => edit(null)}
                        onDeleted={() => edit(null)}
                    />
                )}
            </Modal>
            <Modal
                isOpen={uploadOpen}
                onClose={() => setUploadOpen(false)}
                title="Upload Photos"
                size="lg"
            >
                <PhotoUploadForm
                    onUploaded={(_ids, failed) => {
                        // Keep the modal open when something failed, so the errors stay visible
                        if (failed === 0) setUploadOpen(false);
                    }}
                />
            </Modal>
        </>
    );
};

/** Header action for the Photos view: opens the upload modal */
export const PhotoUploadButton = () => {
    const { setUploadOpen } = usePhotoManager();

    return (
        <IconButton
            name="Plus"
            color="neutral"
            text
            ariaLabel="Upload photos"
            onClick={() => setUploadOpen(true)}
        />
    );
};

/** Pinned footer for the Photos view: saves the dragged order */
export const PhotoOrderFooter = () => {
    const { dirty, saving, saveMessage, saveOrder } = usePhotoManager();

    return (
        <div className="flex flex-row items-center justify-end gap-3">
            {saveMessage ? (
                <span className={saveMessage.ok ? 'text-green-600' : 'text-red-500'}>
                    {saveMessage.text}
                </span>
            ) : (
                dirty && <span className="text-gray-500">Unsaved order</span>
            )}
            <Button margin="0px" onClick={saveOrder} disabled={!dirty || saving}>
                {saving ? 'Saving…' : 'Save Order'}
            </Button>
        </div>
    );
};
