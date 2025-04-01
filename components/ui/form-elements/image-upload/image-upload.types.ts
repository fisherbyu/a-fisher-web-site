import { Image } from '@/types';

type ImageData = Omit<Image, 'id'>;

export type ImageUploadProps = {
    data: ImageData;
    onChange: (data: ImageData) => void;
};
