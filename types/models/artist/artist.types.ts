import { Attribute, Content, Image, Link } from '@/types';

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
