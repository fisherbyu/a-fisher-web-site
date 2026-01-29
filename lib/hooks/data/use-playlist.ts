'use client';
import { fetchPlaylists } from '@/lib';
import useSWR from 'swr';

export const usePlaylists = () => {
    const { data, error, isLoading } = useSWR('/playlist', fetchPlaylists);
    return {
        playlists: data?.data,
        isLoading,
        error,
    };
};
