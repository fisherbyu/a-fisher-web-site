/** URL prefix the `/media/[...path]` route answers on */
export const MEDIA_BASE = '/media';

/**
 * Asset folders and the widths pre-generated for each at upload.
 * Adding a folder needs no migration; changing widths only affects new uploads.
 */
export const FOLDERS = {
    photo: { widths: [640, 960, 1280, 1920, 2560] },
    'music/artist': { widths: [320, 640, 960] },
    'music/album': { widths: [320, 640, 960] },
} as const;

export type Folder = keyof typeof FOLDERS;

export const isFolder = (value: string): value is Folder => value in FOLDERS;

/** The stored fields that locate an asset's files */
export type AssetLocation = {
    folder: string;
    key: string;
    name: string;
};

/** Relative path of one variant, e.g. `photo/k3j9x2mf/delicate-arch-640.webp` */
export const getVariantPath = ({ folder, key, name }: AssetLocation, width: number) =>
    `${folder}/${key}/${name}-${width}.webp`;

/**
 * Snaps a requested width up to the nearest generated one, falling back to the largest.
 *
 * @example
 * snapWidth('photo', 1000); // 1280
 */
export const snapWidth = (folder: string, width: number): number => {
    if (!isFolder(folder)) throw new Error(`Unknown asset folder "${folder}"`);
    const widths: readonly number[] = FOLDERS[folder].widths;
    return widths.find((w) => w >= width) ?? widths[widths.length - 1];
};

/** Public URL of the variant best matching `width` */
export const getAssetSrc = (asset: AssetLocation, width: number) =>
    `${MEDIA_BASE}/${getVariantPath(asset, snapWidth(asset.folder, width))}`;
