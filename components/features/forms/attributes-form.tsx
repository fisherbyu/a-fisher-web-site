import { ReorderableList } from '@/components/ui';
import { Attribute } from '@/types';
import { ReactNode } from 'react';

type AttributesFormProps = {
    data: Attribute[];
    onChange: (data: Attribute[]) => void;
};

type EditAttributeProps = Omit<Attribute, 'id'> & {
    dragHandle: ReactNode;
};
const EditAttribute = (props: EditAttributeProps) => {
    const { title, text, order, dragHandle } = props;

    return (
        <div>
            {dragHandle}
            {title}
            {text}
        </div>
    );
};

export const AttributesForm = ({ data, onChange }: AttributesFormProps) => {
    return (
        <div>
            <h1>Contents</h1>
            <ReorderableList data={data} orderProperty="order" ItemComponent={EditAttribute} onChange={onChange} />
        </div>
    );
};
