import { ApiError, createRoute, getArtists } from '@/server';
import { ARTIST_SORTS, ArtistSort } from '@/types';

const isArtistSort = (value: string): value is ArtistSort =>
    (ARTIST_SORTS as readonly string[]).includes(value);

/** `?sort=rank` (default) follows the favorite-artists ranking; `?sort=name` is alphabetical */
export const GET = createRoute((request) => {
    const sort = request.nextUrl.searchParams.get('sort') ?? 'rank';
    if (!isArtistSort(sort)) {
        throw new ApiError(400, `sort must be one of: ${ARTIST_SORTS.join(', ')}`);
    }
    return getArtists(sort);
});
