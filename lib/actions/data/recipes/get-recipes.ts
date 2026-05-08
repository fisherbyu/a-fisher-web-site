'use server';
import { notion } from '@/lib/notion';
import { transformRecipe } from '@/lib/utils';
import { Recipe } from '@/types';

const RECIPE_DB_ID = '9d17ef1c79914432896a680416f9ba1b';

export const getRecipes = async (): Promise<Recipe[]> => {
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

export const fetchRecipes = async (): Promise<Recipe[]> => {
    return await getRecipes();
};
