import { Recipe } from '@/types';

export const transformRecipe = (recipe: any): Recipe => {
    return {
        id: recipe.id,
        title: recipe.properties.Title.title[0].text.content,
        url: recipe.url,
        img: recipe.cover.external.url,
        icon: {
            type: recipe.icon.type === 'emoji' ? 'emoji' : 'svg',
            content: recipe.icon.type === 'emoji' ? recipe.icon.emoji : recipe.icon.external.url,
        },
        type: recipe.properties.Type?.select?.name ?? null,
        tags: recipe.properties.Tags.multi_select.map((tag: any) => {
            return tag.name;
        }),
    };
};
