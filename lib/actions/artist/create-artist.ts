'use server';
import { Artist } from '@/types';
import { prisma, transformArtist } from '@/lib';

// Input type for creating a new Artist with nested data
type CreateArtistInput = {
    name: string;
    tier: number;
    rank?: number;
    link: {
        appleURI: string;
        spotifyURI: string;
    };
    image: {
        src: string;
        alt: string;
        height: number;
        width: number;
    };
    contents: {
        order: number;
        text: string;
    }[];
    attributes: {
        order: number;
        title: string;
        text: string;
    }[];
};

/**
 * Server Action to Create Artist
 * @param {CreateArtistInput} data
 * @returns {Promise<Artist>}
 */
export async function createArtist(data: CreateArtistInput): Promise<Artist> {
    const { name, tier, rank, link, image, contents, attributes } = data;

    const artist = await prisma.artist.create({
        data: {
            name,
            tier,
            rank,
            link: {
                create: link,
            },
            image: {
                create: image,
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
