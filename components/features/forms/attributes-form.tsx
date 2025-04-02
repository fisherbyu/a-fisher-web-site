import { ReorderableList, TextInput } from '@/components/ui';
import { EditableListItem } from '@/components/ui/form-elements/editable-list-item';
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
            <h1>Contents</h1>
            <ReorderableList data={data} orderProperty="order" ItemComponent={EditAttribute} onChange={onChange} />
        </div>
    );
};
