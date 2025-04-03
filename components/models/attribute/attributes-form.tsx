'use client';
import { useCallback } from 'react';
import { ReorderableList } from '@/components';
import { AttributeDto } from '@/types';
import { AttributesFormProps } from './attributes-form.types';
import { EditAttribute } from './edit-attribute';

export const AttributesForm = ({ data, onChange }: AttributesFormProps) => {
    // Update parent when necessary
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
