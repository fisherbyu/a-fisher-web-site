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

/** An admin area with a list of records and an edit or create form. `id` is its route under `/admin` */
export type AdminListSection<
    T extends AdminRecord = AdminRecord,
    S extends AdminRecord = AdminRecord,
> = SplitNavigatorSection & {
    hideList?: false;
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

/** An admin area with no list: one view fills the detail column. `id` is its route under `/admin` */
export type AdminStandaloneSection = SplitNavigatorSection & {
    hideList: true;
    /** The section's view */
    render: () => ReactNode;
    /** Trailing header content, e.g. an upload button */
    actions?: () => ReactNode;
    /** Content pinned to the bottom of the view, e.g. a save button */
    footer?: () => ReactNode;
};

export type AdminSection = AdminListSection | AdminStandaloneSection;

/** Types a list section against its records while letting mixed sections share one list */
export const defineAdminSection = <T extends AdminRecord, S extends AdminRecord = AdminRecord>(
    section: Omit<AdminListSection<T, S>, 'hideList'>
) => section as unknown as AdminSection;

/** Declares a section without a list, e.g. one that manages all its records in a single view */
export const defineStandaloneSection = (
    section: Omit<AdminStandaloneSection, 'hideList'>
): AdminSection => ({ ...section, hideList: true });
