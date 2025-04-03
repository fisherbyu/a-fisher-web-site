import { AttributeDto } from '@/types';
import { ReorderableList } from '@/components';

import { EditableListItem } from '@/components/ui/form-elements/editable-list-item';
import { ReactNode, useCallback, useState } from 'react';
import { ItemChangeProp } from '@/components/ui/reorderable-list/sortable-item';
import { useDebounce } from '@/lib';
import { EditAttributeData } from './edit-attribute-data/edit-attribute-data';
import { DisplayAttributeData } from './display-attribute-data';

type AttributesFormProps = {
    data: AttributeDto[];
    onChange: (data: AttributeDto[]) => void;
};

type EditAttributeProps = AttributeDto & {
    dragHandle: ReactNode;
    onItemChange: ItemChangeProp<AttributeDto>;
};
const EditAttribute = (props: EditAttributeProps) => {
    // Extract Props
    const { id, title, text, order, dragHandle, onItemChange } = props;

    // Init Local Data Handling
    const [attributeData, setAttributeData] = useState<AttributeDto>({
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

    return (
        <EditableListItem
            dragHandle={dragHandle}
            display={<DisplayAttributeData title={attributeData.title} text={attributeData.text} />}
            edit={<EditAttributeData title={attributeData.title} text={attributeData.text} onChange={handleLocalUpdate} />}
        />
    );
};

export const AttributesForm = ({ data, onChange }: AttributesFormProps) => {
    // Only update parent when necessary
    const handleAttributeChange = useCallback(
        (updatedItems: AttributeDto[]) => {
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
