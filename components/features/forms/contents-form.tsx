import { ReorderableList, TextInput } from '@/components/ui';
import { EditableListItem } from '@/components/ui/form-elements/editable-list-item';
import { ItemChangeProp } from '@/components/ui/reorderable-list/sortable-item';
import { useDebounce } from '@/lib';
import { Content } from '@/types';
import { ReactNode, useState } from 'react';

export type ContentData = Omit<Content, 'id'> & {
    id: string | number;
};

type ContentFormProps = {
    data: ContentData[];
    onChange: (data: ContentData[]) => void;
};

type EditContentsProps = ContentData & {
    dragHandle: ReactNode;
    onItemChange: ItemChangeProp<ContentData>;
};

const EditContents = (props: EditContentsProps) => {
    // Extract Props
    const { id, order, text, dragHandle, onItemChange } = props;

    // Init Local Data Handling
    const [contentData, setCotentData] = useState<ContentData>({
        id: id,
        text: text,
        order: order,
    });

    // Update parent component with debounced changes
    const debouncedUpdate = useDebounce((newData) => {
        onItemChange(newData);
    }, 500); // 500ms delay

    // Handle Local Updates
    const handleLocalUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newData = { ...contentData, [name]: value };

        // Update local state immediately for responsive UI
        setCotentData(newData);

        // Debounce the update to the parent
        debouncedUpdate(newData);
    };

    const displayContents = <div className="truncate">{contentData.text}</div>;

    const editContentData = <TextInput name="text" value={contentData.text} onChange={handleLocalUpdate} multiline />;

    return <EditableListItem dragHandle={dragHandle} display={displayContents} edit={editContentData} />;
};

export const ContentsForm = ({ data, onChange }: ContentFormProps) => {
    return (
        <div>
            <h1>Contents</h1>
            <ReorderableList
                className="flex flex-col gap-1"
                data={data}
                orderProperty="order"
                ItemComponent={EditContents}
                onChange={onChange}
            />
        </div>
    );
};
