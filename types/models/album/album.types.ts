import { Attribute, Content, Image, Link } from '@/types';

export type Album = {
    id: number;
    name: string;
    rank: number;
    contents: Content[];
    attributes: Attribute[];
    link?: Link;
    image?: Image;
};
