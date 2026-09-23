'use client';
import { Artist } from '@/types';

export const fetchArtists = async (): Promise<Artist[]> => {
    const response = await fetch('/api/artist');
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message ?? 'Failed to fetch Artists');
    }
    const data = await response.json();
    return data.data ?? data;
};
