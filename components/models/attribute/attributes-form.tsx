'use client';
import { useCallback } from 'react';
import { ReorderableList } from '@/components';
import { AttributeDto } from '@/types';
import { AttributesFormProps } from './attributes-form.types';
import { EditAttribute } from './edit-attribute';
import { Divider, Icon } from 'thread-ui';

export const AttributesForm = ({ data, onChange, onAdd }: AttributesFormProps) => {
    // Update parent when necessary
    const handleAttributeChange = useCallback(
        (updatedItems: AttributeDto[]) => {
            onChange(updatedItems);
        },
        [onChange]
    );

    return (
        <div className="h-64 overflow-scroll">
            <div className="flex flex-row items-center justify-between">
                <h1>Attributes</h1>
                <button type="button" onClick={onAdd}>
                    <Icon name="Plus" color="info" size={24} />
                </button>
            </div>
            <Divider width="100%" marginY="4px" />
            <ReorderableList
                data={data}
                orderProperty="order"
                ItemComponent={EditAttribute}
                onChange={handleAttributeChange}
                className="flex flex-col gap-1"
            />
        </div>
    );
};
