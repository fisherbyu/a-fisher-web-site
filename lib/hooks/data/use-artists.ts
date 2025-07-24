'use client';
import { fetchArtists } from '@/lib/actions';
import useSWR from 'swr';

export const useArtists = () => {
    const { data, error, isLoading } = useSWR('/artist', fetchArtists);
    return {
        artists: data?.data,
        isLoading,
        error,
    };
};
