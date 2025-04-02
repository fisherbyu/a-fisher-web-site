import { ReactNode } from 'react';

export type SortableItemProps<T extends object> = {
    id: string | number;
    item: T;
    ItemComponent: React.ComponentType<T & { dragHandle: ReactNode }>;
};
