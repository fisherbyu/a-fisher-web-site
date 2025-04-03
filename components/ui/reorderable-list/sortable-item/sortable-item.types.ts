import { ReactNode } from 'react';

export type ItemChangeProp<T> = (data: T) => void;

export type ItemComponentProp<T> = React.ComponentType<T & { dragHandle: ReactNode; onItemChange: ItemChangeProp<T> }>;

export type SortableItemProps<T extends object> = {
    id: string | number;
    item: T;
    ItemComponent: ItemComponentProp<T>;
    onItemChange: ItemChangeProp<T>;
};
