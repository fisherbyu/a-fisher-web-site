'use server';
import { prisma } from '@/lib/prisma';
import { transformArtist } from '@/lib';
import { Artist } from '@/types';

export const getArtists = async (): Promise<Artist[]> => {
    const data = await prisma.artist.findMany({
        include: {
            link: true,
            image: true,
            contents: {
                orderBy: {
                    order: 'asc',
                },
            },
            attributes: {
                orderBy: {
                    order: 'asc',
                },
            },
        },
    });

    return data.map((artist) => transformArtist(artist));
};
