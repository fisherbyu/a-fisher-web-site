'use client';
import { fetchPlaylists } from '@/lib';
import { Playlist } from '@/types';
import useSWR from 'swr';

export const usePlaylists = () => {
    const { data, error, isLoading } = useSWR<Playlist[]>('/playlist', fetchPlaylists);
    return {
        playlists: data,
        isLoading,
        error,
    };
};
