import { ReactNode } from 'react';
import { SplitNavigatorSection } from 'thread-ui';

export type AdminRecord = { id: number | string };

/** A picker in the list header that narrows a section, e.g. albums by artist */
export type AdminScope<S extends AdminRecord = AdminRecord> = {
    /** Picker label, e.g. `'Artist'` */
    title: string;
    /** API route the picker's options are fetched from */
    endpoint: string;
    /** Picker option for a record */
    getOption: (record: S) => { label: string; value: number };
};

/** An editable admin area. `id` is its route under `/admin` */
export type AdminSection<
    T extends AdminRecord = AdminRecord,
    S extends AdminRecord = AdminRecord,
> = SplitNavigatorSection & {
    /** Narrows the section by a picked record; the pick is passed to `endpoint` and `renderCreate` */
    scope?: AdminScope<S>;
    /** API route the section's records are fetched from; a function receives the scope's pick */
    endpoint: string | ((scopeId: number) => string);
    /** Singular label, used for the new row and empty states, e.g. `'artist'` */
    noun: string;
    /** List row text for a record */
    getTitle: (item: T) => string;
    /** Edit view for the selected record */
    renderDetail: (item: T) => ReactNode;
    /** Create view, shown for the new row. Call `onCreated` with the new record's id to select it */
    renderCreate: (onCreated: (id: number) => void, scopeId?: number) => ReactNode;
};

/** Types a section against its records while letting mixed sections share one list */
export const defineAdminSection = <T extends AdminRecord, S extends AdminRecord = AdminRecord>(
    section: AdminSection<T, S>
) => section as unknown as AdminSection;
