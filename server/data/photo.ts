import 'server-only';
import type { Photo, PhotoInput, PhotoUpload } from '@/types';
import { prisma } from '../clients';
import { transformPhoto, photoInclude } from '../data-transformers';
import { deleteOldFiles } from './asset';
import { replaceTags } from './tag';

/**
 * Photos in page order (the admin's manual `sortOrder`).
 * @param drafts Include unpublished photos; admin only
 */
export const getPhotos = async ({ drafts = false }: { drafts?: boolean } = {}): Promise<
    Photo[]
> => {
    const data = await prisma.photo.findMany({
        where: drafts ? undefined : { published: true },
        include: photoInclude,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    return data.map(transformPhoto);
};

/** Creates an unpublished Photo from a stored upload, appended to the end of the page order */
export const createPhoto = async ({
    title,
    camera,
    takenAt,
    stored,
}: PhotoUpload): Promise<Photo> => {
    const { _max } = await prisma.photo.aggregate({ _max: { sortOrder: true } });

    const photo = await prisma.photo.create({
        data: {
            title,
            camera,
            takenAt,
            sortOrder: (_max.sortOrder ?? -1) + 1,
            asset: { create: { ...stored, alt: title } },
        },
        include: photoInclude,
    });

    return transformPhoto(photo);
};

/**
 * Updates a Photo's details and tags. A new image file replaces the stored columns on its
 * Asset row, and the old files are deleted once the save commits.
 */
export const updatePhoto = async (id: number, data: PhotoInput): Promise<Photo> => {
    const { title, caption, camera, takenAt, location, published, tags, image } = data;

    // Only needed when the file is being replaced
    const replaced = image.stored
        ? await prisma.photo
              .findUnique({
                  where: { id },
                  select: { asset: { select: { folder: true, key: true } } },
              })
              .then((photo) => photo?.asset)
        : undefined;

    const photo = await prisma.$transaction(async (tx) => {
        await replaceTags(tx, id, tags);

        return tx.photo.update({
            where: { id },
            data: {
                title,
                // Cleared fields come through as undefined; store them as null
                caption: caption ?? null,
                camera: camera ?? null,
                takenAt: takenAt ?? null,
                location: location ?? null,
                published,
                asset: {
                    update: image.stored
                        ? // TODO(contract): drop `src` once the column is gone
                          { ...image.stored, alt: image.alt, src: null }
                        : { alt: image.alt },
                },
            },
            include: photoInclude,
        });
    });

    if (replaced?.folder && replaced.key) {
        await deleteOldFiles({ folder: replaced.folder, key: replaced.key });
    }

    return transformPhoto(photo);
};

/** Deletes a Photo, its Asset row, and its files */
export const deletePhoto = async (id: number): Promise<void> => {
    const photo = await prisma.photo.findUnique({
        where: { id },
        select: { asset: { select: { id: true, folder: true, key: true } } },
    });
    if (!photo) return;

    // Photo.asset cascades, so deleting the Asset removes the Photo and its tag links
    await prisma.asset.delete({ where: { id: photo.asset.id } });

    const { folder, key } = photo.asset;
    if (folder && key) await deleteOldFiles({ folder, key });
};

/** Sets the page order to the given ids; photos left out keep their current position */
export const reorderPhotos = async (ids: number[]): Promise<void> => {
    await prisma.$transaction(
        ids.map((id, sortOrder) => prisma.photo.update({ where: { id }, data: { sortOrder } }))
    );
};
