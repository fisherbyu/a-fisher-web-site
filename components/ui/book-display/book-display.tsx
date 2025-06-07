'use client';
import React, { useState, useEffect } from 'react';
import { BookDisplayProps, BaseItem } from './book-display.types';

export const BookDisplay = <T extends BaseItem>({
    items,
    renderListItem,
    renderDetail,
    initialSelectedId = null,
    listTitle = 'Items',
    className = '',
    listClassName = '',
    detailClassName = '',
}: BookDisplayProps<T>) => {
    const [selectedId, setSelectedId] = useState<string | number | null>(initialSelectedId || (items.length > 0 ? items[0].id : null));

    const selectedItem = items.find((item) => item.id === selectedId) || null;

    return (
        <div className={`flex w-full h-full ${className}`}>
            {/* List Panel */}
            <div className={`w-52 border-r border-gray-200 p-4 overflow-auto ${listClassName}`}>
                <h2 className="text-xl font-bold mb-4">{listTitle}</h2>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className={`cursor-pointer p-2 rounded ${selectedId === item.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        >
                            {renderListItem(item)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Detail Panel */}
            <div className={`w-full p-4 ${detailClassName}`}>
                {selectedItem ? (
                    renderDetail(selectedItem)
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Select an item to view details</div>
                )}
            </div>
        </div>
    );
};
