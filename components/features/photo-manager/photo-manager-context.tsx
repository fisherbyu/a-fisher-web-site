'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { useRefresh } from '@/lib';
import { Asset, Photo } from '@/types';
import { reorderPhotosAction } from '@/server/data/photo.actions';

/** Same key as the admin's drafts list, so edits and uploads refresh it */
const PHOTOS_KEY = '/api/photo?drafts=true';

/** A photo in the arrange grid. `order` is rewritten by the list on reorder */
export type PhotoTile = {
    id: number;
    title: string;
    asset: Asset;
    published: boolean;
    order: number;
};

type PhotoManagerState = {
    photos?: Photo[];
    isLoading: boolean;
    error?: unknown;
    /** Photos in their current on-screen order, including unsaved drags */
    order: PhotoTile[];
    setOrder: (tiles: PhotoTile[]) => void;
    /** The on-screen order differs from the saved one */
    dirty: boolean;
    saving: boolean;
    saveMessage?: { ok: boolean; text: string };
    saveOrder: () => Promise<void>;
    /** Photo open in the edit modal */
    editing?: Photo;
    edit: (id: number | null) => void;
    uploadOpen: boolean;
    setUploadOpen: (open: boolean) => void;
};

const PhotoManagerContext = createContext<PhotoManagerState | null>(null);

const toTile = ({ id, title, asset, published }: Photo, order: number): PhotoTile => ({
    id,
    title,
    asset,
    published,
    order,
});

/**
 * Applies a locally dragged order to the latest photos: kept photos stay where they were
 * dragged, deleted ones drop out, and new uploads join at the end.
 */
const applyOrder = (photos: Photo[], ids: number[] | null): Photo[] => {
    if (!ids) return photos;

    const byId = new Map(photos.map((photo) => [photo.id, photo]));
    const kept = ids.flatMap((id) => byId.get(id) ?? []);
    const placed = new Set(kept.map(({ id }) => id));
    return [...kept, ...photos.filter(({ id }) => !placed.has(id))];
};

/**
 * State for the admin Photos section. Its grid, upload button, and save footer render in
 * separate `SplitNavigator` slots, so they share order and modal state through this provider.
 * Wrap it around the admin navigator; it only fetches while a `/admin/photo` route is open.
 *
 * @example
 * <PhotoManagerProvider>
 *     <AdminNavigator sections={sections} />
 * </PhotoManagerProvider>
 */
export const PhotoManagerProvider = ({ children }: { children: ReactNode }) => {
    const active = usePathname().startsWith('/admin/photo');
    const { data: photos, isLoading, error } = useSWR<Photo[]>(active ? PHOTOS_KEY : null);
    const refresh = useRefresh(['/api/photo']);

    // Dragged order as ids; `null` follows the saved order
    const [localOrder, setLocalOrder] = useState<number[] | null>(null);
    const ordered = applyOrder(photos ?? [], localOrder);
    const order = ordered.map(toTile);
    const dirty = ordered.some((photo, index) => photo.id !== photos?.[index]?.id);

    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<PhotoManagerState['saveMessage']>();

    const saveOrder = async () => {
        setSaving(true);
        setSaveMessage(undefined);

        const formData = new FormData();
        order.forEach(({ id }) => formData.append('order', String(id)));
        const result = await reorderPhotosAction(formData);
        setSaving(false);

        if (!result.ok) {
            setSaveMessage({ ok: false, text: result.message });
            return;
        }
        setSaveMessage({ ok: true, text: 'Order saved' });
        await refresh();
        setLocalOrder(null);
    };

    const [editingId, setEditingId] = useState<number | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);

    const state: PhotoManagerState = {
        photos,
        isLoading,
        error,
        order,
        setOrder: (tiles) => {
            setSaveMessage(undefined);
            setLocalOrder(tiles.map(({ id }) => id));
        },
        dirty,
        saving,
        saveMessage,
        saveOrder,
        editing: photos?.find(({ id }) => id === editingId),
        edit: setEditingId,
        uploadOpen,
        setUploadOpen,
    };

    return <PhotoManagerContext.Provider value={state}>{children}</PhotoManagerContext.Provider>;
};

/** Reads the Photos section state. Must render inside `PhotoManagerProvider` */
export const usePhotoManager = () => {
    const state = useContext(PhotoManagerContext);
    if (!state) throw new Error('usePhotoManager must be used within PhotoManagerProvider');
    return state;
};
