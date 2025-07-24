'use client';
import { fetchPlaylist } from '@/lib';
import useSWR from 'swr';

export const usePlaylists = () => {
    const { data, error, isLoading } = useSWR('/playlist', fetchPlaylist);
    return {
        playlists: data?.data,
        isLoading,
        error,
    };
};
