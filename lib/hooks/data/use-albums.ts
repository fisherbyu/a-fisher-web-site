'use client';
import { Album } from '@/types';
import useSWR from 'swr';

export const useAlbums = () => {
    const { data, error, isLoading } = useSWR<Album[]>('/api/album');
    return {
        albums: data,
        isLoading,
        error,
    };
};
