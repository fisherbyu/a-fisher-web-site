'use server';
import { notion } from '@/lib/notion';
import { transformRecipe } from '@/lib/utils';
import { ApiResponse } from '@/types';
import { Recipe } from '@/types';

const RECIPE_DB_ID = '9d17ef1c79914432896a680416f9ba1b';

export const getRecipes = async () => {
    const recipeData = await notion.databases.query({
        database_id: RECIPE_DB_ID,
        filter: {
            and: [
                {
                    property: 'Publish',
                    select: {
                        equals: 'True',
                    },
                },
            ],
        },
    });

    return recipeData.results.map((recipe) => transformRecipe(recipe));
};

export const fetchRecipes = async (): Promise<ApiResponse<Recipe[]>> => {
    try {
        return {
            data: await getRecipes(),
        };
    } catch (error) {
        return {
            error: 'Failed to fetch Recipes from Notion',
            message: error instanceof Error ? error.message : 'Unknown error fetching recipes',
        };
    }
};
