'use client';
import { Playlist } from '@/types';
import useSWR from 'swr';

export const usePlaylists = () => {
    const { data, error, isLoading } = useSWR<Playlist[]>('/api/playlist');
    return {
        playlists: data,
        isLoading,
        error,
    };
};
