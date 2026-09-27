import type { Prettify } from 'thread-ui';
import type { Asset, AssetInput, Input, StoredAsset } from '@/types';

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

/** A Photo as submitted by the edit form. Order is set separately by the arrange view */
export type PhotoInput = Prettify<Omit<Input<Photo>, 'asset'> & { image: AssetInput }>;

/** A freshly stored upload, before it has a row */
export type PhotoUpload = {
    title: string;
    camera?: string;
    takenAt?: Date;
    stored: StoredAsset;
};
