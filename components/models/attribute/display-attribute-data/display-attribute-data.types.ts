import { Attribute } from '@/types';

export type DisplayAttributeDataProps = Omit<Attribute, 'id' | 'order'>;
