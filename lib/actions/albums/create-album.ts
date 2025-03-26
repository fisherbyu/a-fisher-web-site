'use sever';
import { prisma } from '@/lib';

import { Album } from '@/types';

export const createAlbum = async (album: Omit<Album, 'id'>): Promise<Album> => {
    const record = await prisma.album.create({
        data: {
            name: album.name,
            rank: album.rank,
            content: {
                create: album.content,
            },
            tags: {
                create: album.tags,
            },
            link: {
                create: album.link,
            },
            image: {
                create: album.image,
            },
        },
        include: {
            tags: true,
            content: true,
            link: true,
            image: true,
        },
    });

    return {
        id: record.id,
        name: record.name,
        rank: record.rank ?? undefined,
        content: record.content,
        tags: record.tags,
        link: record.link,
        image: record.image,
    };
};
