import { getArtists } from '@/lib';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Fetch Data, select random
        const data = await getArtists();
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomArtist = data[randomIndex];

        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        }).format(new Date());

        // Return success
        return NextResponse.json(
            {
                status: 'success',
                message: 'API is working properly',
                timestamp: formattedDate,
                data: randomArtist,
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    Pragma: 'no-cache',
                },
            }
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
