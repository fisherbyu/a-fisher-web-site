import { makeRequest } from '@/lib/http';
import { Artist } from '@/types';
import useSWR from 'swr';

const fetchArtists = async (): Promise<Artist[]> => {
    return await makeRequest<Artist[]>('/artist');
};

export const useArtists = () => {
    const { data, error, isLoading } = useSWR('/artist', fetchArtists);

    return {
        artists: data,
        isLoading,
        error,
    };
};
