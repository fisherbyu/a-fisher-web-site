import { Recipe } from '@/types';
import { NotionIcon } from 'thread-ui';

export const transformRecipe = (recipe: any): Recipe => {
    return {
        id: recipe.id,
        title: recipe.properties.Title.title[0].text.content,
        url: recipe.url,
        img: recipe.cover?.external?.url ?? recipe.cover?.file?.url ?? null,
        icon: recipe.icon as NotionIcon | undefined,
        type: recipe.properties.Type?.select?.name ?? null,
        tags: recipe.properties.Tags.multi_select.map((tag: any) => {
            return tag.name;
        }),
    };
};
