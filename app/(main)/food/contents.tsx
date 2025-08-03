'use client';

import { InfoCard } from '@/.yalc/thread-ui/dist';
import { useRecipes } from '@/lib';

export default function RecipeContents() {
    const { recipes, isLoading, error } = useRecipes();

    return (
        <section className="grid grid-cols-1 gap-1 mt-8 md:grid-cols-2 lg:grid-cols-3 ">
            {recipes
                ?.sort((a, b) => a.title.localeCompare(b.title))
                .map((recipe, _) => <InfoCard key={_} title={recipe.title} url={recipe.url} icon={recipe.icon} img={recipe.img} />)}
        </section>
    );
}
