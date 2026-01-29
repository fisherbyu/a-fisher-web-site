'use client';
import { ApiResponse, Artist } from '@/types';

export const fetchArtists = async (): Promise<ApiResponse<Artist[]>> => {
    try {
        const response = await fetch('/api/artist');
        const data = await response.json();
        return { data };
    } catch (error) {
        return {
            error: 'Failed to fetch Artists',
            message: error instanceof Error ? error.message : 'Unknown error fetching Artists',
        };
    }
};
