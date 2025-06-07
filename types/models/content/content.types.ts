import { DtoId } from '../dto';

/**
 * Content Model
 */
export type Content = {
    id: number;
    order: number;
    text: string;
};

export type ContentDto = Omit<Content, 'id'> & {
    id: DtoId;
};
