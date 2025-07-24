import { getAlbums } from '@/lib';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const data = await getAlbums();

        return NextResponse.json(data, {
            status: 200,
        });
    } catch (error) {
        // Handle errors
        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to fetch album data',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
