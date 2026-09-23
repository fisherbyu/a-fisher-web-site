import { getRecipes, createRoute } from '@/server';

export const GET = createRoute(getRecipes);
