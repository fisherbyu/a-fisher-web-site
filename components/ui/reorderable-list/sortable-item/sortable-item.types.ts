import { ReactNode } from 'react';

export type ItemComponentProp<T> = React.ComponentType<T & { dragHandle: ReactNode }>;

export type SortableItemProps<T extends object> = {
    id: string | number;
    item: T;
    ItemComponent: ItemComponentProp<T>;
};
