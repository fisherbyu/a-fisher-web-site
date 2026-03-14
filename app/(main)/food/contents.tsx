'use client';
import {
    ColumnLayout,
    InfoCard,
    InlineFilterControls,
    SkeletonLayout,
    SortControls,
    useSortControls,
    useFilterControls,
    useDataDisplayControls,
    DataDisplayControls,
} from 'thread-ui';
import { useRecipes } from '@/lib';
export default function RecipeContents() {
    const { recipes, isLoading, error } = useRecipes();

    const TYPE_OPTIONS = ['Main', 'Side', 'Dessert', 'Bread', 'Sauce', 'Condiment'];

    const { refinedData, dataDisplayControlsProps } = useDataDisplayControls({
        data: recipes || [],
        fields: [
            {
                key: 'type',
                label: 'Type',
                filterOptions: TYPE_OPTIONS,
                sortOrder: ['Main', 'Side', 'Dessert', 'Bread', 'Sauce', 'Condiment'],
            },
        ],
        defaultSort: [
            { key: 'type', direction: 'asc' },
            { key: 'title', direction: 'asc' },
        ],
        alwaysSortedFields: [{ key: 'title', label: 'Title' }],
        multiSort: true,
    });

    if (isLoading) {
        return (
            <SkeletonLayout mdcol={2} lgcol={3} rows={3} itemConfig={{ h: '238px', w: '391px' }} />
        );
    }

    return (
        <>
            <div className="max-w-[1400px] px-16 mx-auto flex flex-col items-start gap-2">
                <DataDisplayControls {...dataDisplayControlsProps} />
            </div>
            <ColumnLayout
                mdcol={2}
                lgcol={3}
                items={
                    refinedData?.map((recipe) => ({
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
