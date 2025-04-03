import { ReorderableList, TextInput } from '@/components/ui';
import { EditableListItem } from '@/components/ui/form-elements/editable-list-item';
import { Attribute } from '@/types';
import { ReactNode, useCallback, useState } from 'react';
import { ItemChangeProp, ItemComponentProp } from '@/components/ui/reorderable-list/sortable-item';
import { HandleInputChanges, useDebounce } from '@/lib';

export type AttributeData = Omit<Attribute, 'id'> & {
    id: string | number;
};

type AttributesFormProps = {
    data: AttributeData[];
    onChange: (data: AttributeData[]) => void;
};

type EditAttributeProps = AttributeData & {
    dragHandle: ReactNode;
    onItemChange: ItemChangeProp<AttributeData>;
};
const EditAttribute = (props: EditAttributeProps) => {
    // Extract Props
    const { id, title, text, order, dragHandle, onItemChange } = props;

    // Init Local Data Handling
    const [attributeData, setAttributeData] = useState<AttributeData>({
        id: id,
        title: title,
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
        const newData = { ...attributeData, [name]: value };

        // Update local state immediately for responsive UI
        setAttributeData(newData);

        // Debounce the update to the parent
        debouncedUpdate(newData);
    };

    // Temp Define Display/Forms
    const displayAttribute = (
        <div className="flex flex-col justify-start">
            <h3 className="font-medium">{attributeData.title}</h3>
            <p className="font-light">{attributeData.text}</p>
        </div>
    );

    const editAttributeData = (
        <div className="flex flex-col justify-start">
            <TextInput name="title" title={'Title'} value={attributeData.title} onChange={handleLocalUpdate} required />
            <TextInput name="text" title={'Text'} value={attributeData.text} onChange={handleLocalUpdate} required />
        </div>
    );

    return <EditableListItem dragHandle={dragHandle} display={displayAttribute} edit={editAttributeData} />;
};

export const AttributesForm = ({ data, onChange }: AttributesFormProps) => {
    // Only update parent when necessary
    const handleAttributeChange = useCallback(
        (updatedItems: AttributeData[]) => {
            onChange(updatedItems);
        },
        [onChange]
    );

    return (
        <div>
            <h1>Attributes</h1>
            <ReorderableList data={data} orderProperty="order" ItemComponent={EditAttribute} onChange={handleAttributeChange} />
        </div>
    );
};
