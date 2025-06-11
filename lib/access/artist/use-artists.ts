import { makeRequest } from '@/lib/http';
import { Artist } from '@/types';
import useSWR from 'swr';

export const fetchArtists = async (): Promise<Artist[]> => {
    return await makeRequest<Artist[]>('/artist');
};

export const useArtists = () => {
    const { data, error, isLoading } = useSWR(`/artist`, fetchArtists);
    console.log('data', data);
    return {
        artists: data,
        isLoading,
        error: error,
    };
};
