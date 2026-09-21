'use server';
import { prisma, transformAlbum, albumInclude } from '@/lib';
import { Album } from '@/types';

export const getAlbums = async (): Promise<Album[]> => {
    const data = await prisma.album.findMany({
        include: albumInclude,
    });

    return data.map(transformAlbum);
};
