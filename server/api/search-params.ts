import { MUSIC_SORTS, MusicSort } from '@/types';
import { ApiError } from './api-error';

/** Reads `?sort=`, defaulting to `rank`; throws a 400 for anything else */
export const parseMusicSort = (params: URLSearchParams): MusicSort => {
    const sort = params.get('sort') ?? 'rank';
    if (!(MUSIC_SORTS as readonly string[]).includes(sort)) {
        throw new ApiError(400, `sort must be one of: ${MUSIC_SORTS.join(', ')}`);
    }
    return sort as MusicSort;
};

/** Reads an optional positive integer param; throws a 400 when present but malformed */
export const parseOptionalId = (params: URLSearchParams, name: string): number | undefined => {
    const value = params.get(name);
    if (value === null) return undefined;

    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new ApiError(400, `${name} must be a positive integer`);
    }
    return id;
};
