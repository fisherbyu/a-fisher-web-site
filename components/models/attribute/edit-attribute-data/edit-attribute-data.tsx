import { TextInput } from '@/components';
import { EditAttributeDataProps } from './edit-attribute.types';

export const EditAttributeData = ({ title, text, onChange }: EditAttributeDataProps) => {
    return (
        <div className="flex flex-col justify-start">
            <TextInput name="title" title={'Title'} value={title} onChange={onChange} required />
            <TextInput name="text" title={'Text'} value={text} onChange={onChange} required />
        </div>
    );
};
