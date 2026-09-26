'use client';
import { RankingList, RankingListSummary } from '@/types';
import useSWR from 'swr';

/** Names of every ranking list, without entries */
export const useRankingLists = () => {
    const { data, error, isLoading } = useSWR<RankingListSummary[]>('/api/ranking');
    return {
        rankingLists: data,
        isLoading,
        error,
    };
};

/** One ranking list with its entries. Pass `null` to skip fetching */
export const useRankingList = (slug: string | null) => {
    const { data, error, isLoading } = useSWR<RankingList>(slug && `/api/ranking/${slug}`);
    return {
        rankingList: data,
        isLoading,
        error,
    };
};
