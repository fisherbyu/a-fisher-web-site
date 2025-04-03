import { Attribute, AttributeDto, Content, ContentDto, Image, ImageDto, Link, LinkDto } from '@/types';
import { DtoId } from '../dto';

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

export type ArtistDto = Omit<Artist, 'id' | 'contents' | 'attributes' | 'link' | 'image'> & {
    id: DtoId;
    contents: ContentDto[];
    attributes: AttributeDto[];
    link?: LinkDto;
    image?: ImageDto;
};
