'use client';
import { useState } from 'react';
import { EditableListItemProps } from './editable-list-item.types';
import { Icon } from 'thread-ui';

export const EditableListItem = ({ display, edit, dragHandle }: EditableListItemProps) => {
    // Handle Opening Edit
    const [open, setOpen] = useState(false);
    const toggleContents = () => setOpen(!open);

    return (
        <div
            className={`w-full flex flex-row gap-3 justify-between py-2 px-3 border rounded-md items-start ${open ? 'items-start' : 'items-center'}`}
        >
            {dragHandle}
            <div className="flex-grow w-full overflow-hidden">{open ? edit : display}</div>
            <button className="self-start" onClick={toggleContents}>
                <Icon name={open ? 'XSquare' : 'NotePencil'} color="info" size={24} />
            </button>
        </div>
    );
};
