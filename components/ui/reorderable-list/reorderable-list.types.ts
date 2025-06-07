import { ReactNode } from 'react';
import { ItemComponentProp } from './sortable-item';

export type ReorderableListProps<T> = {
    data: T[];
    orderProperty: keyof T;
    ItemComponent: ItemComponentProp<T>;
    onChange: (data: T[]) => void;
    className?: string;
};
