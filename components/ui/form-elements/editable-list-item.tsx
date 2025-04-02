import { ReactNode, useState } from 'react';
import { Icon } from 'thread-ui';

type EditableListItemProps = {
    display: ReactNode;
    edit: ReactNode;
    dragHandle: ReactNode;
};

export const EditableListItem = ({ display, edit, dragHandle }: EditableListItemProps) => {
    const [contents, setContents] = useState(display);

    const toggleContents = () => {
        if (contents == display) {
            setContents(edit);
        } else {
            setContents(display);
        }
    };
    return (
        <div className="w-full flex flex-row justify-between items-center">
            {dragHandle}
            {contents}
            <button onClick={toggleContents}>
                <Icon name="NotePencil" color="info" size={24} />
            </button>
        </div>
    );
};
