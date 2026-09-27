import 'server-only';
import type { Folder } from '@/lib/media';
import type { StoredAsset } from '@/types';
import { processImage } from './process-image';
import { generateKey, slugify, writeAssetFiles } from './storage';

/** Keep in sync with `serverActions.bodySizeLimit` and `proxyClientMaxBodySize` in next.config */
export const MAX_IMAGE_BYTES = 30 * 1024 * 1024;

export type FormImageResult = { stored?: StoredAsset; error?: string };

/**
 * Reads an image from form data and stores it: processes the variants, writes them under a new key,
 * and returns the Asset columns to save. Returns neither field when no file was picked and none is required.
 * Files are written before the row, so a failed save leaves orphaned files, never a row without files.
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
    const picked = file instanceof File && file.size > 0;

    if (!picked) return required ? { error: 'An image is required' } : {};
    if (!file.type.startsWith('image/')) return { error: 'The file must be an image' };
    if (file.size > MAX_IMAGE_BYTES) {
        return { error: `Images must be under ${MAX_IMAGE_BYTES / 1024 / 1024}MB` };
    }

    try {
        const processed = await processImage(Buffer.from(await file.arrayBuffer()), folder);
        const location = { folder, key: generateKey(), name: slugify(name) };
        await writeAssetFiles(location, processed.variants);

        return {
            stored: {
                ...location,
                width: processed.width,
                height: processed.height,
                blurDataUrl: processed.blurDataUrl,
            },
        };
    } catch (error) {
        console.error('Image processing failed:', error);
        return { error: 'Could not process this image' };
    }
};
