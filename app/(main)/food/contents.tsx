'use client';
import { ColumnLayout, InfoCard, SkeletonLayout, SortControls } from 'thread-ui';
import { useRecipes } from '@/lib';
import { useSortControls } from 'thread-ui';

export default function RecipeContents() {
    const { recipes, isLoading, error } = useRecipes();

    const { sortedData, sortControlsProps } = useSortControls({
        data: recipes || [],
        fields: [
            {
                key: 'type',
                label: 'Type',
                sortOrder: ['Main', 'Side', 'Dessert', 'Bread', 'Sauce', 'Condiment'],
            },
            { key: 'title', label: 'Title' },
        ],
        multi: true,
        defaultSort: [
            { key: 'type', direction: 'asc' },
            { key: 'title', direction: 'asc' },
        ],
    });

    if (isLoading) {
        return (
            <SkeletonLayout mdcol={2} lgcol={3} rows={3} itemConfig={{ h: '238px', w: '391px' }} />
        );
    }

    return (
        <>
            <div className="max-w-[1400px] px-16 mx-auto">
                <SortControls color="secondary" {...sortControlsProps} />
            </div>
            <ColumnLayout
                mdcol={2}
                lgcol={3}
                items={
                    sortedData?.map((recipe) => ({
                        key: recipe.url,
                        content: (
                            <InfoCard
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
