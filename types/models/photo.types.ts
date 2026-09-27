import type { Asset } from './asset.types';

export type Tag = {
    id: number;
    name: string;
};

export type Photo = {
    id: number;
    title: string;
    caption?: string;
    camera?: string;
    takenAt?: Date;
    location?: string;
    published: boolean;
    tags: Tag[];
    asset: Asset;
};
