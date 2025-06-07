import { Attribute, AttributeDto, Content, ContentDto, Image, ImageDto, Link, LinkDto } from '@/types';
import { DtoId } from '../dto';

export type Album = {
    id: number;
    name: string;
    rank: number;
    contents: Content[];
    attributes: Attribute[];
    link?: Link;
    image?: Image;
};

export type AlbumDto = Omit<Album, 'id' | 'contents' | 'attributes' | 'link' | 'image'> & {
    id: DtoId;
    contents: ContentDto[];
    attributes: AttributeDto[];
    link?: LinkDto;
    image: ImageDto;
};
