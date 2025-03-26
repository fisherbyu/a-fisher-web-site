import { Artist, PrismaArtist } from '@/types';

export const transformArtist = (data: PrismaArtist): Artist => {
    return {
        id: data.id,
        name: data.name,
        tier: data.tier,
        rank: data.rank ?? undefined,
        content: data.content,
        tags: data.tags,
        link: data.link,
        image: data.image,
    };
};
