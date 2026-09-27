import 'server-only';
import type { Photo } from '@/types';
import { prisma } from '../clients';
import { transformPhoto, photoInclude } from '../data-transformers';

/**
 * Published photos, newest first. Photos with no date sort last, then by title.
 */
export const getPhotos = async (): Promise<Photo[]> => {
    const data = await prisma.photo.findMany({
        where: { published: true },
        include: photoInclude,
        orderBy: [{ takenAt: { sort: 'desc', nulls: 'last' } }, { title: 'asc' }],
    });

    return data.map(transformPhoto);
};
