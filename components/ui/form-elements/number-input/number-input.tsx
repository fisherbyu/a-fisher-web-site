import { FormLabel } from '../form-label';
import { INPUT_STYLES } from '../input-styles';
import { NumberInputProps } from './number-input.types';

export const NumberInput = ({ name, id = name, title, value, required, onChange, min }: NumberInputProps) => {
    return (
        <div>
            <FormLabel id={id} name={name} title={title} />
            <input
                type="number"
                id={id}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                className={INPUT_STYLES.standard}
                min={min}
            />
        </div>
    );
};
