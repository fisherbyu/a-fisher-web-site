import { Icon } from 'thread-ui';
import { ImageDisplayProps } from './image-display.types';

export const ImageDisplay = ({ src, action }: ImageDisplayProps) => {
    const styles = { height: 'auto', width: 'auto', maxWidth: '256px', maxHeight: '400px' };
    if (action) {
        return (
            <div className="flex flex-row justify-center gap-3 ">
                <img src={src} alt="Preview" className="w-full h-full object-cover rounded max-w-24 max-h-24" />
                <button type="button" onClick={action}>
                    <Icon name="XSquare" size={16} color="error" />
                </button>
            </div>
        );
    }
    return <img src={src} alt="Preview" className="w-full h-full object-cover rounded" style={styles} />;
};
