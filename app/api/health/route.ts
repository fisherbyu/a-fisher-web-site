import { getArtists } from '@/lib';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch Data, select random
        const data = await getArtists();

        const randomIndex = Math.floor(Math.random() * data.length);
        const randomArtist = data[randomIndex];

        // Return success
        return res.status(200).json({
            status: 'success',
            message: 'API is working properly',
            data: randomArtist,
        });
    } catch (error) {
        // Handle errors
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch artist data',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
