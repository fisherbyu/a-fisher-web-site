'use server';
import { prisma, transformArtist } from '@/lib';

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

    return transformArtist(record);
};
