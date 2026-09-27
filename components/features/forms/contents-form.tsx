import { useDebounce } from '@/lib';
import { useState } from 'react';
import { IconButton, ReorderableList, TextInput, type ReorderableItemProps } from 'thread-ui';
import { EditableListItem } from '@/components/ui/editable-list-item';

// Form-only paragraph row; `id` is a local React key and never leaves the form
export type ContentData = {
    id: string;
    order: number;
    text: string;
};

// Stored paragraphs -> keyed form rows
export const toContentData = (contents: string[]): ContentData[] =>
    contents.map((text, order) => ({ id: crypto.randomUUID(), order, text }));

// Keyed form rows -> ordered paragraphs, dropping blanks
export const fromContentData = (data: ContentData[]): string[] =>
    [...data]
        .sort((a, b) => a.order - b.order)
        .map(({ text }) => text.trim())
        .filter(Boolean);

type ContentFormProps = {
    data: ContentData[];
    onChange: (data: ContentData[]) => void;
    onAdd: () => void;
};

// Screen reader label for each paragraph row
const getContentLabel = (item: ContentData, index: number) =>
    item.text.trim().slice(0, 40) || `Empty paragraph ${index + 1}`;

const EditContents = (props: ReorderableItemProps<ContentData>) => {
    // Extract Props
    const { item, dragHandle, onItemChange, onItemRemove } = props;

    // Init Local Data Handling
    const [contentData, setCotentData] = useState<ContentData>(item);

    // Update parent component with debounced changes
    const debouncedUpdate = useDebounce((newData) => {
        onItemChange(newData);
    }, 500); // 500ms delay

    // Handle Local Updates
    const handleLocalUpdate = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const newData = { ...contentData, [name]: value };

        // Update local state immediately for responsive UI
        setCotentData(newData);

        // Debounce the update to the parent
        debouncedUpdate(newData);
    };

    const displayContents = <div className="w-full truncate">{contentData.text}</div>;

    const editContentData = (
        <TextInput name="text" value={contentData.text} onChange={handleLocalUpdate} multiline />
    );

    const deleteContentItem = (
        <IconButton
            name="Trash"
            type="button"
            size="md"
            color="error"
            onClick={onItemRemove}
            aria-label="Delete paragraph"
            text
        />
    );

    return (
        <div className="py-0.5">
            <EditableListItem
                dragHandle={dragHandle}
                displayView={displayContents}
                editView={editContentData}
                deleteButton={deleteContentItem}
            />
        </div>
    );
};

export const ContentsForm = ({ data, onChange, onAdd }: ContentFormProps) => {
    return (
        <div className="h-64 overflow-scroll">
            <ReorderableList
                title="Contents"
                divider
                secondaryContent={
                    <IconButton
                        name="Plus"
                        type="button"
                        onClick={onAdd}
                        color="info"
                        text
                        size="md"
                    >
                        Add new Item
                    </IconButton>
                }
                value={data}
                orderProperty="order"
                ItemComponent={EditContents}
                onChange={onChange}
                getItemLabel={getContentLabel}
            />
        </div>
    );
};
