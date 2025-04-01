import { FormLabel } from '../form-label';
import { TextInputProps } from './text-input.types';
import { INPUT_STYLES } from '../input-styles';

export const TextInput = ({ name, id = name, title, value, required, placeholder, onChange }: TextInputProps) => {
    return (
        <div className="w-full p-1">
            <FormLabel id={id} name={name} title={title} />
            <input
                type="text"
                id={id}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={INPUT_STYLES.standard}
            />
        </div>
    );
};
