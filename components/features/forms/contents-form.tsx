import { ReorderableList, TextInput } from '@/components/ui';
import { Content } from '@/types';
import { ReactNode } from 'react';

type ContentFormProps = {
    data: Content[];
    onChange: (data: Content[]) => void;
};

type EditContentsProps = Omit<Content, 'id'> & {
    dragHandle: ReactNode;
};

const EditContents = (props: EditContentsProps) => {
    const { order, text, dragHandle } = props;
    return (
        <div className="flex flex-row justify-between items-center">
            {dragHandle}
            <TextInput name="text" />
        </div>
    );
};

export const ContentsForm = ({ data, onChange }: ContentFormProps) => {
    return (
        <div>
            <ReorderableList data={data} orderProperty="order" ItemComponent={EditContents} onChange={onChange} />
        </div>
    );
};
