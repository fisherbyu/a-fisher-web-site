import { getRankingListSummaries, createRoute } from '@/server';

// Names only; load a list's entries from `/api/ranking/[slug]`
export const GET = createRoute(getRankingListSummaries);
