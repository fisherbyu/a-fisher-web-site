import { Attribute, AttributeDto, Content, ContentDto, Image, ImageDto, Link, LinkDto } from '@/types';

export type ArtistDto = Omit<Artist, 'id' | 'contents' | 'attributes' | 'link' | 'image'> & {
    id: string | number;
    contents: ContentDto[];
    attributes: AttributeDto[];
    link?: LinkDto;
    image?: ImageDto;
};

export type Artist = {
    id: number;
    name: string;
    tier: number;
    rank?: number;
    contents: Content[];
    attributes: Attribute[];
    link?: Link;
    image?: Image;
};
