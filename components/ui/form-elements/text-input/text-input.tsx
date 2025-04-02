import { FormLabel } from '../form-label';
import { TextInputProps } from './text-input.types';
import { INPUT_STYLES } from '../input-styles';
import { InputWrapper } from '../input-wrapper';

export const TextInput = ({ name, id = name, title, value, required, placeholder, multiline = false, onChange }: TextInputProps) => {
    return (
        <InputWrapper>
            {title && <FormLabel id={id} name={name} title={title} />}
            {multiline ? (
                <textarea
                    id={id}
                    name={name}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={3}
                    className={`${INPUT_STYLES.standard} min-h-[100px] resize-y`}
                />
            ) : (
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
            )}
        </InputWrapper>
    );
};
