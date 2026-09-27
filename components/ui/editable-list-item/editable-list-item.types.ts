import { ReactNode } from 'react';

export type EditableListItemProps = {
    displayView: ReactNode;
    editView: ReactNode;
    dragHandle: ReactNode;
    deleteButton?: ReactNode;
};
