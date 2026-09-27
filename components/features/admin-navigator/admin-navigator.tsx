'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { Dropdown, IconButton, SplitNavigator } from 'thread-ui';
import { SignOutButton } from '../sign-out-button';
import { AdminRecord, AdminSection } from './admin-navigator.types';

/** Sentinel id for the unsaved row shown while creating */
const NEW = 'new';
/** Sentinel id for the section-wide arrange view */
const ARRANGE = 'arrange';

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

    const { scope } = section;

    // Scoped sections wait for a pick, defaulting to the first option; each remembers its own
    const { data: scopeRecords, isLoading: scopeLoading } = useSWR<AdminRecord[]>(
        scope?.endpoint ?? null
    );
    const scopeOptions = scope ? (scopeRecords ?? []).map(scope.getOption) : [];
    const [scopeIds, setScopeIds] = useState<Record<string, number>>({});
    const scopeId = scope ? (scopeIds[section.id] ?? scopeOptions[0]?.value) : undefined;

    const endpoint =
        typeof section.endpoint === 'string'
            ? section.endpoint
            : scopeId === undefined
              ? null
              : section.endpoint(scopeId);
    const { data, isLoading } = useSWR<AdminRecord[]>(endpoint);

    // Ids repeat across sections, so a selection only counts where it was made
    const view = `${section.id}:${scopeId ?? ''}`;
    const [selection, setSelection] = useState<{ view: string; id: Row['id'] } | null>(null);
    const item = selection?.view === view ? selection.id : null;
    const select = (id: Row['id'] | null) => setSelection(id === null ? null : { view, id });

    const saved: Row[] = (data ?? []).map((record) => ({
        id: record.id,
        title: section.getTitle(record),
        data: record,
    }));
    // Pseudo rows only exist while open, so they can be selected like any other item
    const pseudo: Row[] =
        item === NEW
            ? [{ id: NEW, title: `New ${noun}` }]
            : item === ARRANGE && section.arrange
              ? [{ id: ARRANGE, title: section.arrange.title }]
              : [];
    const rows = [...pseudo, ...saved];

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
                    {row.data
                        ? section.renderDetail(row.data, () => select(null))
                        : row.id === ARRANGE
                          ? section.arrange?.render()
                          : section.renderCreate(select, scopeId)}
                </div>
            )}
            sidebarTitle="Admin"
            sidebarFooter={<SignOutButton />}
            listActions={() => (
                <>
                    {scope && (
                        <Dropdown
                            title={scope.title}
                            showLabel={false}
                            size="sm"
                            value={scopeId ?? null}
                            options={scopeOptions}
                            onChange={(id) => {
                                if (id !== null) setScopeIds({ ...scopeIds, [section.id]: id });
                            }}
                        />
                    )}
                    {section.arrange && (
                        <IconButton
                            name="ArrowsDownUp"
                            color="neutral"
                            text
                            ariaLabel={section.arrange.title}
                            onClick={() => select(ARRANGE)}
                        />
                    )}
                    <IconButton
                        name="Plus"
                        color="neutral"
                        text
                        ariaLabel={`New ${noun}`}
                        disabled={Boolean(scope) && scopeId === undefined}
                        onClick={() => select(NEW)}
                    />
                </>
            )}
            emptyList={isLoading || scopeLoading ? 'Loading…' : `No ${noun}s yet`}
            emptyDetail={`Select a ${noun}, or add a new one`}
        />
    );
};
