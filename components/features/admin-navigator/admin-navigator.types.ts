import { ReactNode } from 'react';
import { SplitNavigatorSection } from 'thread-ui';

export type AdminRecord = { id: number | string };

/** An editable admin area. `id` is its route under `/admin` */
export type AdminSection<T extends AdminRecord = AdminRecord> = SplitNavigatorSection & {
    /** API route the section's records are fetched from */
    endpoint: string;
    /** Singular label, used for the new row and empty states, e.g. `'artist'` */
    noun: string;
    /** List row text for a record */
    getTitle: (item: T) => string;
    /** Edit view for the selected record */
    renderDetail: (item: T) => ReactNode;
    /** Create view, shown for the new row. Call `onCreated` with the new record's id to select it */
    renderCreate: (onCreated: (id: number) => void) => ReactNode;
};

/** Types a section against its record while letting mixed sections share one list */
export const defineAdminSection = <T extends AdminRecord>(section: AdminSection<T>) =>
    section as unknown as AdminSection;
