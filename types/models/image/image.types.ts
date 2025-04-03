export type Image = {
    id: number;
    src: string;
    alt: string;
    height: number;
    width: number;
};

export type ImageDto = Omit<Image, 'id'> & {
    id: 'string' | number;
};
