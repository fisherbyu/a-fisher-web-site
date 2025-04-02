import { FormLabel } from '../form-label';
import { TextInputProps } from './text-input.types';
import { INPUT_STYLES } from '../input-styles';
import { InputWrapper } from '../input-wrapper';

export const TextInput = ({ name, id = name, title, value, required, placeholder, onChange }: TextInputProps) => {
    return (
        <InputWrapper>
            {title && <FormLabel id={id} name={name} title={title} />}
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
        </InputWrapper>
    );
};
