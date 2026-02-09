import { ApiResponse, Playlist } from '@/types';

export const fetchPlaylists = async (): Promise<ApiResponse<Playlist[]>> => {
    try {
        const response = await fetch('/api/playlist');
        const data = await response.json();
        return { data };
    } catch (error) {
        return {
            error: 'Failed to fetch Playlists',
            message: error instanceof Error ? error.message : 'Unknown Error fetching playlists',
        };
    }
};
