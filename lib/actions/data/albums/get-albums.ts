'use server';
import { prisma, transformAlbum } from '@/lib';
import { Album } from '@/types';

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
