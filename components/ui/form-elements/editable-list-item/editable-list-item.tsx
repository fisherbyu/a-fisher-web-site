import { useState } from 'react';
import { EditableListItemProps } from './editable-list-item.type';
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
            <div className="flex-grow">{open ? edit : display}</div>
            <button className="self-start" onClick={toggleContents}>
                <Icon name={open ? 'XSquare' : 'NotePencil'} color="info" size={24} />
            </button>
        </div>
    );
};
