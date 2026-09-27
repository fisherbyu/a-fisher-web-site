'use client';
import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

/**
 * Revalidates every SWR key under the given API paths, e.g. `/api/artist` covers `/api/artist?sort=name`.
 * Server Actions can't reach the client's SWR cache, so call this after one changes data.
 *
 * @example
 * const refresh = useRefresh(['/api/photo']);
 * await deletePhotoAction(id);
 * refresh();
 */
export const useRefresh = (paths: string[]) => {
    const { mutate } = useSWRConfig();
    const key = paths.join('|');

    return useCallback(
        () =>
            mutate(
                (swrKey) =>
                    typeof swrKey === 'string' &&
                    key.split('|').some((path) => swrKey.startsWith(path))
            ),
        [mutate, key]
    );
};
