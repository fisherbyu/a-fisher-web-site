'use client';
import { fetchRecipes } from '@/lib';
import { Recipe } from '@/types';
import useSWR from 'swr';

export const useRecipes = () => {
    const { data, error, isLoading } = useSWR<Recipe[]>('/recipes', fetchRecipes);
    return {
        recipes: data,
        isLoading,
        error,
    };
};
