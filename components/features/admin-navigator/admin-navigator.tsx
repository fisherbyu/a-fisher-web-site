'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { Dropdown, IconButton, SplitNavigator } from 'thread-ui';
import { SignOutButton } from '../sign-out-button';
import { AdminRecord, AdminSection } from './admin-navigator.types';

/** Sentinel id for the unsaved row shown while creating */
const NEW = 'new';

type Row = { id: number | string; title: string; data?: AdminRecord };

/** Standalone sections pass one row, which the navigator shows in place of a list */
const VIEW = 'view';

/**
 * Admin editor shell built on `SplitNavigator`: admin sections in the sidebar, the
 * active section's records in the list, and an edit or create form in the detail.
 * Standalone sections hide the list and fill the detail with their own view.
 * Rendered once from a layout so it stays mounted while sections change; the route
 * decides the section and the selected record is local.
 *
 * @example
 * <AdminNavigator sections={[defineAdminSection<Artist>({ id: 'artist', ... })]} />
 */
export const AdminNavigator = ({ sections }: { sections: AdminSection[] }) => {
    const pathname = usePathname();
    const section = sections.find(({ id }) => pathname.startsWith(`/admin/${id}`)) ?? sections[0];
    // Standalone sections have no records; hooks still run with nothing to fetch
    const listSection = section.hideList ? undefined : section;
    const standalone = section.hideList ? section : undefined;
    const scope = listSection?.scope;

    // Scoped sections wait for a pick, defaulting to the first option; each remembers its own
    const { data: scopeRecords, isLoading: scopeLoading } = useSWR<AdminRecord[]>(
        scope?.endpoint ?? null
    );
    const scopeOptions = scope ? (scopeRecords ?? []).map(scope.getOption) : [];
    const [scopeIds, setScopeIds] = useState<Record<string, number>>({});
    const scopeId = scope ? (scopeIds[section.id] ?? scopeOptions[0]?.value) : undefined;

    const endpoint = !listSection
        ? null
        : typeof listSection.endpoint === 'string'
          ? listSection.endpoint
          : scopeId === undefined
            ? null
            : listSection.endpoint(scopeId);
    const { data, isLoading } = useSWR<AdminRecord[]>(endpoint);

    // Ids repeat across sections, so a selection only counts where it was made
    const view = `${section.id}:${scopeId ?? ''}`;
    const [selection, setSelection] = useState<{ view: string; id: Row['id'] } | null>(null);
    const item = selection?.view === view ? selection.id : null;
    const select = (id: Row['id'] | null) => setSelection(id === null ? null : { view, id });

    const noun = listSection?.noun ?? '';
    const saved: Row[] = listSection
        ? (data ?? []).map((record) => ({
              id: record.id,
              title: listSection.getTitle(record),
              data: record,
          }))
        : [];
    // The draft row only exists while creating, so it can be selected like any other item
    const rows: Row[] = standalone
        ? [{ id: VIEW, title: standalone.title }]
        : item === NEW
          ? [{ id: NEW, title: `New ${noun}` }, ...saved]
          : saved;

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
                    {standalone
                        ? standalone.render()
                        : row.data
                          ? listSection?.renderDetail(row.data)
                          : listSection?.renderCreate(select, scopeId)}
                </div>
            )}
            detailActions={() => standalone?.actions?.()}
            detailFooter={() => standalone?.footer?.()}
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
