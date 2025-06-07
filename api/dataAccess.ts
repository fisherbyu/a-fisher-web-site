// Import Static Data
import StaticArtists from '@/api/static_content/artists.json';
import StaticAlbums from '@/api/static_content/albums.json';

// Define Types
export enum DataType {
    Artist = 'Artist',
    Album = 'Album',
}

// API Endpoint
const endpoint = 'https://api.fisherandrew.org';

// Load Static Data if API can't be accessed
function getStaticData(type: DataType) {
    switch (type) {
        case DataType.Artist:
            return StaticArtists;
        case DataType.Album:
            return StaticAlbums;
    }
}

// Get Data from API
export async function getData(type: DataType) {
    try {
        // Fetch Data from API
        const response = await fetch(`${endpoint}/${type}`);

        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }

        return await response.json();
    } catch (error) {
        // Catch Error and return Static Data
        console.error(error);

        return getStaticData(type);
    }
}
