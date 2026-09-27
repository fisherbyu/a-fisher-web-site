import 'server-only';
import sharp from 'sharp';
import exifr from 'exifr';
import { getVariantWidths, type Folder } from '@/lib/media';

export type ImageVariant = {
    width: number;
    data: Buffer;
};

export type ImageExif = {
    camera?: string;
    takenAt?: Date;
};

export type ProcessedImage = {
    /** Full-resolution dimensions after orientation, used for aspect ratio */
    width: number;
    height: number;
    blurDataUrl: string;
    variants: ImageVariant[];
    exif: ImageExif;
};

const BLUR_WIDTH = 10;
const VARIANT_QUALITY = 80;

/**
 * Reads the EXIF fields the admin form prefills.
 * Returns empty fields when the file has no EXIF (e.g. stripped on export).
 */
const readExif = async (input: Buffer): Promise<ImageExif> => {
    const exif = await exifr
        .parse(input, { pick: ['Make', 'Model', 'DateTimeOriginal'] })
        .catch(() => undefined);
    if (!exif) return {};

    // Model often already starts with the make ("Canon EOS R6"), so avoid "Canon Canon EOS R6"
    const make: string | undefined = exif.Make?.trim();
    const model: string | undefined = exif.Model?.trim();
    const camera = make && model && !model.startsWith(make) ? `${make} ${model}` : model ?? make;

    return {
        camera: camera || undefined,
        takenAt: exif.DateTimeOriginal instanceof Date ? exif.DateTimeOriginal : undefined,
    };
};

/**
 * Turns an uploaded image into everything an `Asset` needs: dimensions, blur placeholder,
 * one WebP per width from `getVariantWidths`, and parsed EXIF.
 * Variants are re-encoded without metadata, so GPS and camera serials never reach the served files.
 *
 * @example
 * const processed = await processImage(buffer, 'photo');
 */
export const processImage = async (input: Buffer, folder: Folder): Promise<ProcessedImage> => {
    // Bake EXIF orientation into the pixels before metadata is stripped, and normalize color
    const base = sharp(input, { failOn: 'none' }).rotate().toColourspace('srgb');

    // metadata() reports pre-rotation dimensions; orientations 5-8 are rotated 90°
    const meta = await sharp(input).metadata();
    if (!meta.width || !meta.height) throw new Error('Could not read image dimensions');
    const swapped = (meta.orientation ?? 1) >= 5;
    const width = swapped ? meta.height : meta.width;
    const height = swapped ? meta.width : meta.height;

    const variants: ImageVariant[] = [];
    // Sequential to keep memory flat on large originals
    for (const w of getVariantWidths(folder, width)) {
        const data = await base
            .clone()
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: VARIANT_QUALITY })
            .toBuffer();
        variants.push({ width: w, data });
    }

    const blur = await base.clone().resize({ width: BLUR_WIDTH }).webp({ quality: 50 }).toBuffer();

    return {
        width,
        height,
        blurDataUrl: `data:image/webp;base64,${blur.toString('base64')}`,
        variants,
        exif: await readExif(input),
    };
};
