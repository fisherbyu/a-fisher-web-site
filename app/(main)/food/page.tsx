import type { Metadata } from 'next';
import { PageHeader } from 'thread-ui';
import RecipeContents from './contents';

export default function FoodPage() {
    return (
        <>
            <PageHeader
                title="My Recipes"
                caption="I've loved cooking and baking for as long as I remember.    Its a way for me to express love to others while fulfilling their basic needs and a creative outlet that never runs dry.    Here are some of my favorite recipes."
                center
            />
            <RecipeContents />
        </>
    );
}

export let metadata: Metadata = {
    title: 'My Recipes',
};
