export type AttributeDto = Omit<Attribute, 'id'> & {
    id: string | number;
};

export type Attribute = {
    id: number;
    order: number;
    title: string;
    text: string;
};
