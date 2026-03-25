'use client';
import {
    ColumnLayout,
    InfoCard,
    SkeletonLayout,
    useDataDisplayControls,
    DataDisplayControls,
    Container,
} from 'thread-ui';
import { useRecipes } from '@/lib';
import { LoadingError } from '@/components';
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
            <SkeletonLayout mdcol={2} lgcol={3} rows={3} itemConfig={{ h: '238px', w: '100%' }} />
        );
    }

    if (error) {
        return <LoadingError />;
    }

    return (
        <Container>
            <div className="sm:px-2 lg:px-4 mx-auto flex flex-col items-start gap-2">
                <DataDisplayControls
                    showFilterLabel
                    showSortLabel
                    size="sm"
                    {...dataDisplayControlsProps}
                />
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
                container={false}
            />
        </Container>
    );
}
