'use client';
import { Photo } from '@/types';
import useSWR from 'swr';

/**
 * Published photos, newest first.
 *
 * @example
 * const { photos } = usePhotos();
 */
export const usePhotos = () => {
    const { data, error, isLoading } = useSWR<Photo[]>('/api/photo');
    return {
        photos: data,
        isLoading,
        error,
    };
};
