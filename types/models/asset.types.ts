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

/** Asset columns produced by processing an upload */
export type StoredAsset = Omit<Asset, 'id' | 'alt'>;

/**
 * An image as submitted by a form: its alt text, plus the newly stored file when one was picked.
 * Without `stored`, the existing file is kept and only `alt` is updated.
 */
export type AssetInput = {
    alt: string;
    stored?: StoredAsset;
};
