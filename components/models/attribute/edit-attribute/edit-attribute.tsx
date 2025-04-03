import { useState } from 'react';
import { useDebounce } from '@/lib';
import { AttributeDto } from '@/types';

import { EditAttributeProps } from './edit-attribute.types';
import { EditableListItem } from '@/components/ui';
import { DisplayAttributeData } from '../display-attribute-data';
import { EditAttributeData } from '../edit-attribute-data';

export const EditAttribute = (props: EditAttributeProps) => {
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
