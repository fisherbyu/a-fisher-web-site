'use client';
import { Album } from '@/types';

export const fetchAlbums = async (): Promise<Album[]> => {
    const response = await fetch('/api/album');
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message ?? 'Failed to fetch Albums');
    }
    const data = await response.json();
    return data.data ?? data;
};
