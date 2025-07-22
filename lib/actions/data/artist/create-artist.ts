'use server';
import { Artist, ArtistDto } from '@/types';
import { prisma, transformArtist } from '@/lib';

/**
 * Server Action to Create Artist
 * @param {CreateArtistInput} data
 * @returns {Promise<Artist>}
 */
export async function createArtist(data: ArtistDto): Promise<Artist> {
    // Extract Data
    const {
        name,
        tier,
        rank,
        link: { id: linkId, ...linkData },
        image: { id: imgId, ...imgData },
        contents: contentsWithIds,
        attributes: attributesWithIds,
    } = data;

    // Remove IDs from arrays
    const contents = contentsWithIds.map(({ id, ...rest }) => rest);
    const attributes = attributesWithIds.map(({ id, ...rest }) => rest);

    // Add to Database
    const artist = await prisma.artist.create({
        data: {
            name,
            tier,
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
        // Return full Artist Object
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

    return transformArtist(artist);
}
