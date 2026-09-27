'use client';
import { Artist, MusicSort } from '@/types';
import useSWR from 'swr';

/**
 * All artists, ranked by the favorite-artists list unless another sort is asked for.
 *
 * @example
 * const { artists } = useArtists();
 *
 * @example
 * const { artists } = useArtists({ sort: 'name' });
 */
export const useArtists = ({ sort = 'rank' }: { sort?: MusicSort } = {}) => {
    const { data, error, isLoading } = useSWR<Artist[]>(`/api/artist?sort=${sort}`);
    return {
        artists: data,
        isLoading,
        error,
    };
};
