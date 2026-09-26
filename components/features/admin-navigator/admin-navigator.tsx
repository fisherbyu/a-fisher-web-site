'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { IconButton, SplitNavigator } from 'thread-ui';
import { SignOutButton } from '../sign-out-button';
import { AdminRecord, AdminSection } from './admin-navigator.types';

/** Sentinel id for the unsaved row shown while creating */
const NEW = 'new';

type Row = { id: number | string; title: string; data?: AdminRecord };

/**
 * Admin editor shell built on `SplitNavigator`: admin sections in the sidebar, the
 * active section's records in the list, and an edit or create form in the detail.
 * Rendered once from a layout so it stays mounted while sections change; the route
 * decides the section and the selected record is local.
 *
 * @example
 * <AdminNavigator sections={[defineAdminSection<Artist>({ id: 'artist', ... })]} />
 */
export const AdminNavigator = ({ sections }: { sections: AdminSection[] }) => {
    const pathname = usePathname();
    const section = sections.find(({ id }) => pathname.startsWith(`/admin/${id}`)) ?? sections[0];
    const { noun } = section;

    const { data, isLoading } = useSWR<AdminRecord[]>(section.endpoint);

    // Ids repeat across sections, so a selection only counts in the section it was made in
    const [selection, setSelection] = useState<{ section: string; id: Row['id'] } | null>(null);
    const item = selection?.section === section.id ? selection.id : null;
    const select = (id: Row['id'] | null) =>
        setSelection(id === null ? null : { section: section.id, id });

    const saved: Row[] = (data ?? []).map((record) => ({
        id: record.id,
        title: section.getTitle(record),
        data: record,
    }));
    // The draft row only exists while creating, so it can be selected like any other item
    const rows = item === NEW ? [{ id: NEW, title: `New ${noun}` }, ...saved] : saved;

    return (
        <SplitNavigator<Row>
            sections={sections}
            section={section.id}
            getSectionHref={({ id }) => `/admin/${id}`}
            items={rows}
            item={item}
            onItemChange={select}
            detailTitle={(row) => row.title}
            renderItem={(row) => <span className="font-medium">{row.title}</span>}
            renderDetail={(row) => (
                <div className="px-4 pb-4">
                    {row.data ? section.renderDetail(row.data) : section.renderCreate()}
                </div>
            )}
            sidebarTitle="Admin"
            sidebarFooter={<SignOutButton />}
            listActions={() => (
                <IconButton
                    name="Plus"
                    color="neutral"
                    text
                    ariaLabel={`New ${noun}`}
                    onClick={() => select(NEW)}
                />
            )}
            emptyList={isLoading ? 'Loading…' : `No ${noun}s yet`}
            emptyDetail={`Select a ${noun}, or add a new one`}
        />
    );
};
