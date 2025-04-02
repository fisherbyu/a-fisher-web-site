'use client';
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { ReorderableListProps } from './reorderable-list.types';

export const ReorderableList = <T extends { id: string | number }>({
    data,
    orderProperty,
    ItemComponent,
    onChange,
    className,
}: ReorderableListProps<T>) => {
    // Track items locally for immediate UI updates
    const [items, setItems] = useState(data);

    // Configure sensors for mouse, touch, and keyboard interactions
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Find current indices
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            // Reorder Array
            const newItems = arrayMove(items, oldIndex, newIndex);

            // Update OrderProperty on each Item
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                [orderProperty]: index + 1,
            }));

            // Update UI
            setItems(updatedItems);

            // Update Data
            onChange(updatedItems);
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => ({ id: item.id }))} strategy={verticalListSortingStrategy}>
                <div className={className}>
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id} item={item} ItemComponent={ItemComponent} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
