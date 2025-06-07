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
        // Create the response object
        const responseObj = {
            status: 'success',
            message: 'API is working properly',
            timestamp: formattedDate,
            data: randomArtist,
        };

        // Pretty print the JSON with 2 spaces for indentation
        const prettyJson = JSON.stringify(responseObj, null, 2);

        // Return success with properly formatted JSON
        return new Response(prettyJson, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Pragma: 'no-cache',
            },
        });
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
