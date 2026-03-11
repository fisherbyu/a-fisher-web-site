'use client';
import {
    ColumnLayout,
    InfoCard,
    InlineFilterControls,
    SkeletonLayout,
    SortControls,
    useSortControls,
    useFilterControls,
} from 'thread-ui';
import { useRecipes } from '@/lib';

export default function RecipeContents() {
    const { recipes, isLoading, error } = useRecipes();

    const TYPE_OPTIONS = ['Main', 'Side', 'Dessert', 'Bread', 'Sauce', 'Condiment'];

    const { filteredData, filterControlsProps } = useFilterControls({
        data: recipes || [],
        fields: [
            {
                key: 'type',
                label: 'Type',
                options: TYPE_OPTIONS,
            },
        ],
    });

    const { sortedData, sortControlsProps } = useSortControls({
        data: filteredData || [],
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
            <div className="max-w-[1400px] px-16 mx-auto flex flex-col items-start gap-2">
                <InlineFilterControls
                    fieldTitleDisplay="none"
                    color="secondary"
                    hideReset
                    {...filterControlsProps}
                />
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
