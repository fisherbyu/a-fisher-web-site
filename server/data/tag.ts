import 'server-only';
import type { Prisma } from '@prisma/client';

/**
 * Builds the nested `create` payload for a Photo's tag links.
 * Reuses an existing `Tag` when the name matches, otherwise creates it.
 *
 * @example
 * photo: { create: { tags: { create: toTagCreate(tags) } } }
 */
export const toTagCreate = (tags: { name: string }[]): Prisma.PhotoTagCreateWithoutPhotoInput[] =>
    tags.map(({ name }) => ({
        tag: {
            connectOrCreate: {
                where: { name },
                create: { name },
            },
        },
    }));

/**
 * Replaces every tag link on a Photo with the submitted list.
 * Existing links are dropped first so the `[photoId, tagId]` composite key
 * can't collide. Orphaned `Tag` rows are left in place.
 *
 * @example
 * await prisma.$transaction(async (tx) => {
 *     await replaceTags(tx, id, tags);
 *     return tx.photo.update({ ... });
 * });
 */
export const replaceTags = async (
    tx: Prisma.TransactionClient,
    photoId: number,
    tags: { name: string }[]
) => {
    await tx.photoTag.deleteMany({ where: { photoId } });

    await tx.photo.update({
        where: { id: photoId },
        data: {
            tags: {
                create: toTagCreate(tags),
            },
        },
    });
};
