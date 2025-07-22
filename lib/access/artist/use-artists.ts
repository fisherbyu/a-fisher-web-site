import { getArtists } from '@/lib/actions';
import { Artist } from '@/types';
import useSWR from 'swr';

const fetchArtists = async (): Promise<Artist[]> => {
    const response = await getArtists();
    if (response.error) {
        throw new Error(response.error);
    }
    return response.data || [];
};

export const useArtists = () => {
    const { data, error, isLoading } = useSWR('/artist', fetchArtists);
    return {
        artists: data,
        isLoading,
        error,
    };
};
