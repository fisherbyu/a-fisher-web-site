import { getRandomArtist, ApiError, createRoute } from '@/server';

export const dynamic = 'force-dynamic';

const formatTimestamp = () =>
    new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    }).format(new Date());

/**
 * Health check. Hits the database on every call to keep Supabase awake,
 * so the response must never be cached anywhere along the way.
 */
export const GET = createRoute(
    async () => {
        const artist = await getRandomArtist();
        if (!artist) throw new ApiError(503, 'No artist data available');

        return {
            message: 'API is working properly',
            timestamp: formatTimestamp(),
            data: artist,
        };
    },
    {
        pretty: true,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
        },
    }
);
