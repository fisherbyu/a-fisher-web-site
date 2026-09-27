import { createRoute, getArtists, parseMusicSort } from '@/server';

/** `?sort=rank` (default) follows the favorite-artists ranking; `?sort=name` is alphabetical */
export const GET = createRoute((request) =>
    getArtists(parseMusicSort(request.nextUrl.searchParams))
);
