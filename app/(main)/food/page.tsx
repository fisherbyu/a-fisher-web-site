import type { Metadata } from 'next';
import { InfoCard, InfoCardProps, PageHeader } from 'thread-ui';
import RecipieData from './recipes.json';

export default function FoodPage() {
    const recipes = RecipieData as InfoCardProps[];
    return (
        <main>
            <PageHeader
                title="My Recipes"
                caption="I've loved cooking and baking for as long as I remember.    Its a way for me to express love to others while fulfilling their basic needs and a creative outlet that never runs dry.    Here are some of my favorite recipes."
                center
            />
            <section className="grid grid-cols-1 gap-1 mt-8 md:grid-cols-2 lg:grid-cols-3 ">
                {recipes
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((recipe, index) => (
                        <InfoCard key={index} title={recipe.title} url={recipe.url} icon={recipe.icon} img={recipe.img} />
                    ))}
            </section>
        </main>
    );
}

export let metadata: Metadata = {
    title: 'My Recipes',
};
