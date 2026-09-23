import { Prisma } from '@prisma/client';
import { Artist } from '@/types';

/** Query shape `transformArtist` expects. Use this as the `include` in every Artist query. */
export const artistInclude = {
    musicItem: {
        include: { link: true, image: true, genres: { include: { genre: true } } },
    },
} satisfies Prisma.ArtistInclude;

/** An `Artist` as returned by a query using `artistInclude`. */
export type PrismaArtist = Prisma.ArtistGetPayload<{ include: typeof artistInclude }>;

export const transformArtist = (data: PrismaArtist): Artist => {
    const { link, image, genres } = data.musicItem;

    if (!link) throw new Error(`Artist ${data.id} is missing a link`);
    if (!image) throw new Error(`Artist ${data.id} is missing an image`);

    return {
        id: data.id,
        name: data.name,
        contents: data.contents,
        favoriteTracks: data.favoriteTracks,
        favoriteAlbums: data.favoriteAlbums,
        link: {
            id: link.id,
            appleURI: link.appleURI,
            spotifyURI: link.spotifyURI,
        },
        image: {
            id: image.id,
            src: image.src,
            alt: image.alt,
            height: image.height,
            width: image.width,
        },
        genres: genres.map(({ genre }) => ({
            id: genre.id,
            name: genre.name,
        })),
    };
};
