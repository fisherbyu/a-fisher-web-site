'use client';
import { useState } from 'react';
import { EditableListItemProps } from './editable-list-item.types';
import { Icon, IconButton } from 'thread-ui';

export const EditableListItem = ({
    display,
    edit,
    dragHandle,
    deleteButton,
}: EditableListItemProps) => {
    // Handle Opening Edit
    const [open, setOpen] = useState(false);
    const toggleContents = () => setOpen(!open);

    return (
        <div
            className={`w-full flex flex-row gap-3 justify-between py-2 px-3  rounded-md items-start ${open ? 'items-start' : 'items-center'}`}
        >
            {dragHandle}
            <div className="flex-grow w-full overflow-hidden">{open ? edit : display}</div>
            <IconButton
                name={open ? 'XSquare' : 'NotePencil'}
                type="button"
                onClick={toggleContents}
                color="info"
                size="md"
                text
            />
            {deleteButton}
        </div>
    );
};
