'use client';
import { Playlist } from '@/types';

export const fetchPlaylists = async (): Promise<Playlist[]> => {
    const response = await fetch('/api/playlist');
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message ?? 'Failed to fetch Playlists');
    }
    const data = await response.json();
    return data.data ?? data;
};
