import { createRoute, getAlbums, parseMusicSort, parseOptionalId } from '@/server';

/**
 * Every album, or one artist's with `?artistId=`. `?sort=rank` (default) follows that
 * artist's album ranking when one exists; `?sort=name` is alphabetical.
 */
export const GET = createRoute((request) => {
    const params = request.nextUrl.searchParams;
    return getAlbums({
        artistId: parseOptionalId(params, 'artistId'),
        sort: parseMusicSort(params),
    });
});
