import { Prisma } from '@prisma/client';
import { Playlist } from '@/types';

/** Query shape `transformPlaylist` expects. Use this as the `include` in every Playlist query. */
export const playlistInclude = {
    link: true,
} satisfies Prisma.PlaylistInclude;

/** A `Playlist` as returned by a query using `playlistInclude`. */
export type PrismaPlaylist = Prisma.PlaylistGetPayload<{ include: typeof playlistInclude }>;

export const transformPlaylist = (data: PrismaPlaylist): Playlist => {
    const { link } = data;

    return {
        id: data.id,
        title: data.title,
        link: {
            id: link.id,
            appleURI: link.appleURI,
            spotifyURI: link.spotifyURI,
        },
    };
};
