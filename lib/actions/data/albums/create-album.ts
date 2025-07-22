'use server';
import { Album, AlbumDto } from '@/types';
import { prisma, transformAlbum } from '@/lib';

/**
 * Server Action to Create Album
 * @param {AlbumDto} data
 * @returns {Promise<Album>}
 */
export async function createAlbum(data: AlbumDto): Promise<Album> {
    // Extract Data
    const {
        name,
        rank,
        link: { id: linkId, ...linkData },
        image: { id: imgId, ...imgData },
        contents: contentsWithIds,
        attributes: attributesWithIds,
    } = data;

    // Remove IDs from arrays
    const contents = contentsWithIds.map(({ id, ...rest }) => rest);
    const attributes = attributesWithIds.map(({ id, ...rest }) => rest);

    const album = await prisma.album.create({
        data: {
            name,
            rank,
            link: {
                create: linkData,
            },
            image: {
                create: imgData,
            },
            contents: {
                create: contents,
            },
            attributes: {
                create: attributes,
            },
        },
        // Return full Album Object
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

    return transformAlbum(album);
}
