'use client';
import { Artist } from '@/types';
import useSWR from 'swr';

export const useArtists = () => {
    const { data, error, isLoading } = useSWR<Artist[]>('/artist');
    return {
        artists: data,
        isLoading,
        error,
    };
};
