import 'server-only';
import type { Folder } from '@/lib/media';
import type { StoredAsset } from '@/types';
import { processImage, type ImageExif } from './process-image';
import { generateKey, slugify, writeAssetFiles } from './storage';

/** Keep in sync with `serverActions.bodySizeLimit` and `proxyClientMaxBodySize` in next.config */
export const MAX_IMAGE_BYTES = 30 * 1024 * 1024;

export type StoreImageResult =
    | { ok: true; stored: StoredAsset; exif: ImageExif }
    | { ok: false; error: string };

export type FormImageResult = { stored?: StoredAsset; error?: string };

/**
 * Validates and stores one uploaded image: processes the variants, writes them under a new key,
 * and returns the Asset columns to save plus its EXIF.
 * Files are written before the row, so a failed save leaves orphaned files, never a row without files.
 *
 * @example
 * const upload = await storeImageFile(file, { folder: 'photo', name: title });
 * if (!upload.ok) return { message: upload.error };
 */
export const storeImageFile = async (
    file: File,
    { folder, name }: { folder: Folder; name: string }
): Promise<StoreImageResult> => {
    if (!file.type.startsWith('image/')) return { ok: false, error: 'The file must be an image' };
    if (file.size > MAX_IMAGE_BYTES) {
        return { ok: false, error: `Images must be under ${MAX_IMAGE_BYTES / 1024 / 1024}MB` };
    }

    try {
        const processed = await processImage(Buffer.from(await file.arrayBuffer()), folder);
        const location = { folder, key: generateKey(), name: slugify(name) };
        await writeAssetFiles(location, processed.variants);

        return {
            ok: true,
            stored: {
                ...location,
                width: processed.width,
                height: processed.height,
                blurDataUrl: processed.blurDataUrl,
            },
            exif: processed.exif,
        };
    } catch (error) {
        console.error('Image processing failed:', error);
        return { ok: false, error: 'Could not process this image' };
    }
};

/**
 * Reads a single image field from form data and stores it with `storeImageFile`.
 * Returns neither field when no file was picked and none is required.
 *
 * @example
 * const { stored, error } = await storeFormImage(formData, {
 *     folder: 'music/artist',
 *     name: artist.name,
 *     required: true,
 * });
 * if (error) return { errors: { image: [error] } };
 */
export const storeFormImage = async (
    formData: FormData,
    {
        folder,
        name,
        required,
        field = 'image',
    }: { folder: Folder; name: string; required: boolean; field?: string }
): Promise<FormImageResult> => {
    const file = formData.get(field);
    if (!(file instanceof File) || file.size === 0) {
        return required ? { error: 'An image is required' } : {};
    }

    const upload = await storeImageFile(file, { folder, name });
    return upload.ok ? { stored: upload.stored } : { error: upload.error };
};
