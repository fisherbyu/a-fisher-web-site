import { ReorderableList, TextInput } from '@/components/ui';
import { EditableListItem } from '@/components/ui/form-elements/editable-list-item';
import { Attribute } from '@/types';
import { ReactNode, useState } from 'react';

type AttributeData = Omit<Attribute, 'id'> & {
    id: string | number;
};

type AttributesFormProps = {
    data: AttributeData[];
    onChange: (data: AttributeData[]) => void;
};

type EditAttributeProps = AttributeData & {
    dragHandle: ReactNode;
};
const EditAttribute = (props: EditAttributeProps) => {
    // Extract Props
    const { id, title, text, order, dragHandle } = props;

    // Init Data Handling
    const [attributeData, setAttributeData] = useState<AttributeData[]>([{ id: id, title: title, text: text, order: order }]);

    // Temp Define Display/Forms
    const displayAttribute = (
        <div className="flex flex-col justify-start">
            <h3 className="font-medium">{title}</h3>
            <p className=" font-light">{text}</p>
        </div>
    );

    const editAttributeData = (
        <div className="flex flex-col justify-start">
            <TextInput name={`title-${title}`} title={'Title'} value={title} required />
            <TextInput name={`title-${text}`} title={'Text'} value={text} required />
        </div>
    );

    return <EditableListItem dragHandle={dragHandle} display={displayAttribute} edit={editAttributeData} />;
};

export const AttributesForm = ({ data, onChange }: AttributesFormProps) => {
    return (
        <div>
            <h1>Attributes</h1>
            <ReorderableList data={data} orderProperty="order" ItemComponent={EditAttribute} onChange={onChange} />
        </div>
    );
};
