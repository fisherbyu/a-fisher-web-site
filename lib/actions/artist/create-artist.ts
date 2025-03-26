'use server';
import { prisma } from '@/lib';

import { Artist } from '@/types';

export const createArtist = async (artist: Omit<Artist, 'id'>): Promise<Artist> => {
    const record = await prisma.artist.create({
        data: {
            name: artist.name,
            tier: artist.tier,
            rank: artist.rank,
            content: {
                create: artist.content,
            },
            tags: {
                create: artist.tags,
            },
            link: {
                create: artist.link,
            },
            image: {
                create: artist.image,
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
        tier: record.tier,
        rank: record.rank ?? undefined,
        content: record.content,
        tags: record.tags,
        link: record.link,
        image: record.image,
    };
};
