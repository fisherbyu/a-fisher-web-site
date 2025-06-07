import { AttributeDto } from '@/types';

export type EditAttributeDataProps = Omit<AttributeDto, 'id' | 'order'> & {
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
};
