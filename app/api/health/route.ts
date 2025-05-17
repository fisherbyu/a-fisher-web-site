import { getArtists } from '@/lib';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Fetch Data, select random
        const data = await getArtists();
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomArtist = data[randomIndex];

        // Return success
        return NextResponse.json(
            {
                status: 'success',
                message: 'API is working properly',
                data: randomArtist,
            },
            { status: 200 }
        );
    } catch (error) {
        // Handle errors
        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to fetch artist data',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
