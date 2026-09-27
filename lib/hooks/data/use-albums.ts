'use client';
import { Album, MusicSort } from '@/types';
import useSWR from 'swr';

/**
 * Albums, ranked by the artist's album ranking unless another sort is asked for.
 * Omit `artistId` for every album; pass `null` to skip fetching until an artist is known.
 *
 * @example
 * const { albums } = useAlbums();
 *
 * @example
 * const { albums } = useAlbums({ artistId: coldplay.id });
 */
export const useAlbums = ({
    artistId,
    sort = 'rank',
}: { artistId?: number | null; sort?: MusicSort } = {}) => {
    const params = new URLSearchParams({ sort });
    if (artistId != null) params.set('artistId', String(artistId));

    const { data, error, isLoading } = useSWR<Album[]>(
        artistId === null ? null : `/api/album?${params}`
    );
    return {
        albums: data,
        isLoading,
        error,
    };
};
