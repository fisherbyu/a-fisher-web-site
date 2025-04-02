import { ReactNode } from 'react';

export type ReorderableListProps<T> = {
    data: T[];
    orderProperty: keyof T;
    ItemComponent: React.ComponentType<T & { dragHandle: ReactNode }>;
    onChange: (data: T[]) => void;
};
