'use server';
import { Artist } from '@/types';
import { prisma, transformArtist } from '@/lib';

// Input type for creating a new Artist with nested data
type CreateArtistInput = {
    name: string;
    tier: number;
    rank?: number;
    link?: {
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

    // Use Prisma's nested writes to create the artist and related records
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
        // Include all related data in the response
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

// Example usage:
/*
const newArtist = await createArtist({
  name: "Radiohead",
  tier: 1,
  link: {
    appleURI: "https://music.apple.com/us/artist/radiohead/657515",
    spotifyURI: "spotify:artist:4Z8W4fKeB5YxbusRsdQVPb"
  },
  image: {
    src: "/images/radiohead.jpg",
    alt: "Radiohead band photo",
    height: 800,
    width: 1200
  },
  contents: [
    { order: 1, text: "Radiohead is an English rock band formed in Abingdon, Oxfordshire, in 1985." },
    { order: 2, text: "The band consists of Thom Yorke, Jonny Greenwood, Colin Greenwood, Ed O'Brien, and Philip Selway." }
  ],
  attributes: [
    { order: 1, title: "Genre", text: "Alternative Rock, Art Rock, Experimental Rock" },
    { order: 2, title: "Best Albums", text: "OK Computer, Kid A, In Rainbows" }
  ]
});
*/
