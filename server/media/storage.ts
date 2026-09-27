import 'server-only';
import { randomInt } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getVariantPath, type AssetLocation } from '@/lib/media';
import type { ImageVariant } from './process-image';

const KEY_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const KEY_LENGTH = 8;
const MAX_NAME_LENGTH = 80;

const getMediaRoot = () => {
    const root = process.env.MEDIA_ROOT;
    if (!root) throw new Error('MEDIA_ROOT is not set');
    return path.resolve(root);
};

/**
 * Resolves a path relative to MEDIA_ROOT, rejecting anything that escapes it (e.g. `..`).
 */
export const resolveMediaPath = (relativePath: string) => {
    const root = getMediaRoot();
    const resolved = path.resolve(root, relativePath);
    if (!resolved.startsWith(root + path.sep))
        throw new Error(`Path escapes MEDIA_ROOT: ${relativePath}`);
    return resolved;
};

/** Random, immutable asset key, e.g. `k3j9x2mf` */
export const generateKey = () =>
    Array.from({ length: KEY_LENGTH }, () => KEY_ALPHABET[randomInt(KEY_ALPHABET.length)]).join('');

/**
 * URL-safe file name from a title or original file name.
 *
 * @example
 * slugify('DSC_0412 (edit).JPG'); // 'dsc-0412-edit-jpg'
 * slugify('X&Y'); // 'x-and-y'
 */
export const slugify = (value: string) =>
    value
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, MAX_NAME_LENGTH)
        .replace(/-+$/, '') || 'image';

/** Writes every variant of an asset under `{folder}/{key}/` */
export const writeAssetFiles = async (location: AssetLocation, variants: ImageVariant[]) => {
    await mkdir(resolveMediaPath(`${location.folder}/${location.key}`), { recursive: true });
    for (const { width, data } of variants) {
        await writeFile(resolveMediaPath(getVariantPath(location, width)), data);
    }
};

/** Removes an asset's folder. Missing folders are ignored. */
export const deleteAssetFiles = async ({ folder, key }: Pick<AssetLocation, 'folder' | 'key'>) => {
    await rm(resolveMediaPath(`${folder}/${key}`), { recursive: true, force: true });
};

/** Reads one file for the `/media` route */
export const readMediaFile = (relativePath: string) => readFile(resolveMediaPath(relativePath));

/**
 * Display title from an uploaded file's name.
 *
 * @example
 * titleFromFileName('provo-canyon-4.jpg'); // 'Provo Canyon 4'
 */
export const titleFromFileName = (fileName: string) =>
    path
        .parse(fileName)
        .name.split(/[-_\s]+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ') || 'Untitled';
