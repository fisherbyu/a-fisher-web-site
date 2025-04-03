export type ContentDto = Omit<Content, 'id'> & {
    id: string | number;
};

/**
 * Content Model
 */
export type Content = {
    id: number;
    order: number;
    text: string;
};
