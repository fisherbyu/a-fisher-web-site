import { Prisma } from '@prisma/client';
import { Album } from '@/types';

/** Query shape `transformAlbum` expects. Use this as the `include` in every Album query. */
export const albumInclude = {
    musicItem: {
        include: { link: true, image: true, genres: { include: { genre: true } } },
    },
} satisfies Prisma.AlbumInclude;

/** An `Album` as returned by a query using `albumInclude`. */
export type PrismaAlbum = Prisma.AlbumGetPayload<{ include: typeof albumInclude }>;

export const transformAlbum = (data: PrismaAlbum): Album => {
    const { link, image, genres } = data.musicItem;

    if (!image) throw new Error(`Album ${data.id} is missing an image`);

    return {
        id: data.id,
        title: data.title,
        releaseDate: data.releaseDate ?? undefined,
        artistId: data.artistId,
        contents: data.contents,
        favoriteTracks: data.favoriteTracks,
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
