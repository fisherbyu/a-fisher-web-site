'use server';
import { prisma } from '@/lib/prisma';
import { transformArtist } from '@/lib';
import { ApiResponse, Artist } from '@/types';

export const getArtists = async (): Promise<ApiResponse<Artist[]>> => {
    try {
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

        return {
            data: data.map((artist) => transformArtist(artist)),
        };
    } catch (error) {
        return {
            error: 'Failed to fetch artists from db',
            message: error instanceof Error ? error.message : 'Unknown Error',
        };
    }
};
