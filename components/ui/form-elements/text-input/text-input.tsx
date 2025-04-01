import { FormLabel } from '../form-label';
import { TextInputProps } from './text-input.types';
import { INPUT_STYLES } from '../input-styles';

export const TextInput = ({ name, id = name, title, value, required, onChange }: TextInputProps) => {
    return (
        <div>
            <FormLabel id={name} title={title} />
            <input
                type="text"
                id={id}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                className={INPUT_STYLES.standard}
            />
        </div>
    );
};
