import { DtoId } from '../dto';

export type Attribute = {
    id: number;
    order: number;
    title: string;
    text: string;
};

export type AttributeDto = Omit<Attribute, 'id'> & {
    id: DtoId;
};
