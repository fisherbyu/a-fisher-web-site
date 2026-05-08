'use client';
import { fetchAlbums } from '@/lib/actions';
import { Album } from '@/types';
import useSWR from 'swr';

export const useAlbums = () => {
    const { data, error, isLoading } = useSWR<Album[]>('/album', fetchAlbums);
    return {
        albums: data,
        isLoading,
        error,
    };
};
