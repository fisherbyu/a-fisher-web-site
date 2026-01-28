'use client';

import { ColumnLayout, InfoCard } from 'thread-ui';
import { useRecipes } from '@/lib';

export default function RecipeContents() {
    const { recipes, isLoading, error } = useRecipes();

    return (
        <>
            <ColumnLayout
                mdcol={2}
                lgcol={3}
                items={
                    recipes
                        ?.sort((a, b) => a.title.localeCompare(b.title))
                        .map((recipe, _) => ({
                            content: <InfoCard key={_} title={recipe.title} url={recipe.url} icon={recipe.icon} img={recipe.img} />,
                        })) ?? []
                }
            />
        </>
    );
}
