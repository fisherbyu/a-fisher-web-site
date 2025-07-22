'use server';
import { prisma } from '@/lib/prisma';
import { transformAlbum } from '@/lib/utils';
import { ApiResponse, Album } from '@/types';

export const getAlbums = async (): Promise<Album[]> => {
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

    return data.map((artist) => transformAlbum(artist));
};

export const fetchAlbums = async (): Promise<ApiResponse<Album[]>> => {
    try {
        return {
            data: await getAlbums(),
        };
    } catch (error) {
        return {
            error: 'Failed to fetch Albums from DB',
            message: error instanceof Error ? error.message : 'Unknown Error fetching albums',
        };
    }
};
