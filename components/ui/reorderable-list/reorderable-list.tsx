'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { ReorderableListProps } from './reorderable-list.types';

export const ReorderableList = React.memo(
    <T extends { id: string | number }>({ data, orderProperty, ItemComponent, onChange, className }: ReorderableListProps<T>) => {
        // Track items locally for immediate UI updates
        const [items, setItems] = useState(data);

        // Update local items when data prop changes
        useEffect(() => {
            setItems(data);
        }, [data]);

        // Configure sensors for mouse, touch, and keyboard interactions
        const sensors = useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
            })
        );

        // Handle drag end with memoized callback
        const handleDragEnd = useCallback(
            (event: DragEndEvent) => {
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
            },
            [items, onChange, orderProperty]
        );

        // Handle Item Change with memoized callback
        const handleItemChange = useCallback(
            (updatedItem: T) => {
                // Find the item index in the current list
                const itemIndex = items.findIndex((item) => item.id === updatedItem.id);
                if (itemIndex !== -1) {
                    // Create a new array with the updated item
                    const updatedItems = [...items];
                    updatedItems[itemIndex] = updatedItem;

                    // Update local state
                    setItems(updatedItems);

                    // Notify parent component
                    onChange(updatedItems);
                }
            },
            [items, onChange]
        );

        return (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((item) => ({ id: item.id }))} strategy={verticalListSortingStrategy}>
                    <div className={className}>
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                item={item}
                                ItemComponent={ItemComponent}
                                onItemChange={handleItemChange}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        );
    }
) as <T extends { id: string | number }>(props: ReorderableListProps<T>) => JSX.Element;
