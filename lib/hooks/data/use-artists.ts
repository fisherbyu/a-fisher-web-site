'use client';
import { Artist } from '@/types';
import useSWR from 'swr';

export const useArtists = () => {
    const { data, error, isLoading } = useSWR<Artist[]>('/api/artist');
    return {
        artists: data,
        isLoading,
        error,
    };
};
