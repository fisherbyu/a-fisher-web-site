'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItemProps } from './sortable-item.types';

export const SortableItem = <T extends object>({ id, item, ItemComponent, onItemChange }: SortableItemProps<T>) => {
    // Init DnD Kit Functionality
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    // DnD Kit Hover/Drag Styling
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Drag Handle
    const dragHandle = (
        <div className="drag-handle" {...attributes} {...listeners}>
            ⋮⋮
        </div>
    );

    return (
        <div ref={setNodeRef} style={style}>
            <ItemComponent {...item} dragHandle={dragHandle} onItemChange={onItemChange} />
        </div>
    );
};
