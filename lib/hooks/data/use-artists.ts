'use client';
import { fetchArtists } from '@/lib';
import { Artist } from '@/types';
import useSWR from 'swr';

export const useArtists = () => {
    const { data, error, isLoading } = useSWR<Artist[]>('/artist', fetchArtists);
    return {
        artists: data,
        isLoading,
        error,
    };
};
