'use client';
import { ColumnLayout, InfoCard, SkeletonLayout } from 'thread-ui';
import { useRecipes } from '@/lib';

export default function RecipeContents() {
    const { recipes, isLoading, error } = useRecipes();

    if (isLoading) {
        return (
            <SkeletonLayout mdcol={2} lgcol={3} rows={1} itemConfig={{ h: '238px', w: '391px' }} />
        );
    }

    return (
        <>
            <ColumnLayout
                mdcol={2}
                lgcol={3}
                items={
                    recipes
                        ?.sort((a, b) => a.title.localeCompare(b.title))
                        .map((recipe, _) => ({
                            content: (
                                <InfoCard
                                    key={_}
                                    title={recipe.title}
                                    url={recipe.url}
                                    icon={recipe.icon}
                                    img={recipe.img}
                                />
                            ),
                        })) ?? []
                }
            />
        </>
    );
}
