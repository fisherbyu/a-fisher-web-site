import { ReactNode } from 'react';

export type BaseItem = {
    id: string | number;
};

export type BookDisplayProps<T extends BaseItem> = {
    items: T[];
    renderListItem: (item: T) => React.ReactNode;
    renderDetail: (item: T) => React.ReactNode;
    initialSelectedId?: string | number | null;
    listTitle?: string;
    className?: string;
    listClassName?: string;
    detailClassName?: string;
    defaultPage?: ReactNode;
};
