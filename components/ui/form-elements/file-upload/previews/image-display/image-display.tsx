import { ImageDisplayProps } from './image-display.types';

export const ImageDisplay = ({ src }: ImageDisplayProps) => {
    return (
        <img
            src={src}
            alt="Preview"
            className="w-full h-full object-cover rounded"
            style={{ height: 'auto', width: 'auto', maxWidth: '256px', maxHeight: '400px' }}
        />
    );
};
