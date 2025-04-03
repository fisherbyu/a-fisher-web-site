import { ItemChangeProp } from '@/components';
import { AttributeDto } from '@/types';
import { ReactNode } from 'react';

export type EditAttributeProps = AttributeDto & {
    dragHandle: ReactNode;
    onItemChange: ItemChangeProp<AttributeDto>;
};
