'use client';
import { ApiResponse, Album } from '@/types';

export const fetchAlbums = async (): Promise<ApiResponse<Album[]>> => {
    try {
        const response = await fetch('/api/album');
        const data = await response.json();
        return { data };
    } catch (error) {
        return {
            error: 'Failed to fetch Albums',
            message: error instanceof Error ? error.message : 'Unknown Error fetching albums',
        };
    }
};
