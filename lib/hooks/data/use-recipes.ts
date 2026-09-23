'use client';
import { Recipe } from '@/types';
import useSWR from 'swr';

export const useRecipes = () => {
    const { data, error, isLoading } = useSWR<Recipe[]>('/api/recipes');
    return {
        recipes: data,
        isLoading,
        error,
    };
};
