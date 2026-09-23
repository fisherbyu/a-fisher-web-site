import { getArtists, createRoute } from '@/server';

export const GET = createRoute(getArtists);
