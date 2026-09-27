import 'server-only';
import type { Prisma } from '@prisma/client';
import type { AssetInput } from '@/types';
import { prisma } from '../clients';
// storage, not the '@/server/media' index: this module is in the '@/server' barrel, and sharp shouldn't load there
import { deleteAssetFiles } from '../media/storage';

/**
 * Nested `create` for a new MusicItem's image. Creating always needs a freshly stored file.
 *
 * @example
 * musicItem: { create: { image: { create: toAssetCreate(image) } } }
 */
export const toAssetCreate = ({
    alt,
    stored,
}: AssetInput): Prisma.AssetCreateWithoutMusicItemsInput => {
    if (!stored) throw new Error('A new image needs a stored file');
    return { ...stored, alt };
};

/**
 * Nested update for an existing MusicItem's image. A new file replaces the stored columns on the
 * same row (new key, same id), so the owner keeps pointing at it; without one only `alt` changes.
 *
 * @example
 * musicItem: { update: { image: toAssetUpdate(image) } }
 */
export const toAssetUpdate = ({
    alt,
    stored,
}: AssetInput): Prisma.AssetUpdateOneWithoutMusicItemsNestedInput =>
    stored
        ? {
              upsert: {
                  create: { ...stored, alt },
                  // TODO(contract): drop `src` once the column is gone
                  update: { ...stored, alt, src: null },
              },
          }
        : { update: { alt } };

/** Where a MusicItem's current image lives, so its files can be removed once it's replaced */
export const getImageLocation = async (musicItemId: number) => {
    const item = await prisma.musicItem.findUnique({
        where: { id: musicItemId },
        select: { image: { select: { folder: true, key: true } } },
    });
    const { folder, key } = item?.image ?? {};
    return folder && key ? { folder, key } : undefined;
};

/**
 * Removes a replaced image's files. Runs after the save commits, and never fails the save:
 * leftovers are orphans that `media-prune` cleans up.
 */
export const deleteReplacedFiles = async (location?: { folder: string; key: string }) => {
    if (!location) return;
    await deleteAssetFiles(location).catch((error) =>
        console.error(`Failed to delete replaced files ${location.folder}/${location.key}:`, error)
    );
};
