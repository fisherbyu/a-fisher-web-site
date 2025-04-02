import { ReorderableList, TextInput } from '@/components/ui';
import { EditableListItem } from '@/components/ui/form-elements/editable-list-item';
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

    const displayContents = <div>{text}</div>;

    const editContentData = <TextInput name={`contents-${order}`} value={text} multiline />;

    return <EditableListItem dragHandle={dragHandle} display={displayContents} edit={editContentData} />;
};

export const ContentsForm = ({ data, onChange }: ContentFormProps) => {
    return (
        <div>
            <h1>Contents</h1>
            <ReorderableList
                className="flex flex-col gap-1"
                data={data}
                orderProperty="order"
                ItemComponent={EditContents}
                onChange={onChange}
            />
        </div>
    );
};
