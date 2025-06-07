import { AttributeDto } from '@/types';

export type AttributesFormProps = {
    data: AttributeDto[];
    onChange: (data: AttributeDto[]) => void;
    onAdd: () => void;
};
