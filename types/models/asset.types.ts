/** A stored image, located by `folder`/`key`/`name` under MEDIA_ROOT */
export type Asset = {
    id: number;
    folder: string;
    key: string;
    name: string;
    width: number;
    height: number;
    blurDataUrl: string;
    alt: string;
};
