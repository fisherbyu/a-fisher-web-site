'use server';
import { prisma } from '@/lib/prisma';
import { transformArtist } from '@/lib';
import { ApiResponse, Artist } from '@/types';

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

export const fetchArtists = async (): Promise<ApiResponse<Artist[]>> => {
    try {
        return {
            data: await getArtists(),
        };
    } catch (error) {
        return {
            error: 'Failed to fetch Artists from DB',
            message: error instanceof Error ? error.message : 'Unknown error fetching artists',
        };
    }
};
