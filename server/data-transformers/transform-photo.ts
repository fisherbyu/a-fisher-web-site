import { Prisma } from '@prisma/client';
import { Photo } from '@/types';
import { transformAsset } from './transform-asset';

/** Query shape `transformPhoto` expects. Use this as the `include` in every Photo query. */
export const photoInclude = {
    asset: true,
    tags: { include: { tag: true } },
} satisfies Prisma.PhotoInclude;

/** A `Photo` as returned by a query using `photoInclude`. */
export type PrismaPhoto = Prisma.PhotoGetPayload<{ include: typeof photoInclude }>;

export const transformPhoto = (data: PrismaPhoto): Photo => ({
    id: data.id,
    title: data.title,
    caption: data.caption ?? undefined,
    camera: data.camera ?? undefined,
    takenAt: data.takenAt ?? undefined,
    location: data.location ?? undefined,
    published: data.published,
    tags: data.tags.map(({ tag }) => ({
        id: tag.id,
        name: tag.name,
    })),
    asset: transformAsset(data.asset),
});
