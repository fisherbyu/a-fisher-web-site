'use server';
import { prisma } from '@/lib/prisma';
import { transformArtist, artistInclude } from '@/lib';
import { Artist } from '@/types';

export const getArtists = async (): Promise<Artist[]> => {
    const data = await prisma.artist.findMany({
        include: artistInclude,
    });

    return data.map(transformArtist);
};
