'use client';
import { useActionState } from 'react';
import { useRefresh } from './use-refresh';

type SaveState = { savedId?: number };

type SaveActionOptions = {
    /** API paths whose cached data the save changes; every key starting with one is refetched */
    refresh: string[];
    /** Called with the saved record's id once the refetch has started */
    onSaved?: (id: number) => void;
};

/**
 * `useActionState` for a form's save action that refreshes the SWR data it changed.
 * Server Actions can't reach the client's SWR cache, so on success (`savedId` set)
 * this revalidates every key under `refresh`, e.g. `/api/artist` covers `/api/artist?sort=name`.
 *
 * @example
 * const [state, formAction, pending] = useSaveAction(action, { refresh: ['/api/playlist'] });
 */
export const useSaveAction = <S extends SaveState>(
    action: (state: S, formData: FormData) => Promise<S>,
    { refresh, onSaved }: SaveActionOptions
) => {
    const refreshPaths = useRefresh(refresh);

    return useActionState<S, FormData>(async (state, formData) => {
        // useActionState types state as Awaited<S>, which is S for these plain objects
        const next = await action(state as S, formData);

        if (next.savedId !== undefined) {
            // Not awaited: the form can settle while the lists refetch
            refreshPaths();
            onSaved?.(next.savedId);
        }

        return next;
    }, {} as Awaited<S>);
};
