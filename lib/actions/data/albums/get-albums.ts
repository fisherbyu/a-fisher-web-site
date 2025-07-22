'use server';
import { prisma } from '@/lib/prisma';
import { transformAlbum } from '@/lib/utils';
import { ApiResponse, Album } from '@/types';

export const getAlbums = async (): Promise<ApiResponse<Album[]>> => {
    try {
        const data = await prisma.album.findMany({
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
            data: data.map((artist) => transformAlbum(artist)),
        };
    } catch (error) {
        return {
            error: 'Failed to fetch albums from db',
            message: error instanceof Error ? error.message : 'Unknown Error',
        };
    }
};
