'use client';
import { fetchRecipes } from '@/lib';
import useSWR from 'swr';

export const useRecipes = () => {
    const { data, error, isLoading } = useSWR('/recipes', fetchRecipes);
    return {
        recipes: data?.data,
        isLoading,
        error,
    };
};
