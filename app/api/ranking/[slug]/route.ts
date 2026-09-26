import { ApiError, createRoute, getRankingListBySlug } from '@/server';
import { RankingList } from '@/types';

export const GET = createRoute<RankingList, { slug: string }>(async (_request, { params }) => {
    const { slug } = await params;
    const list = await getRankingListBySlug(slug);
    if (!list) throw new ApiError(404, 'Ranking list not found');
    return list;
});
