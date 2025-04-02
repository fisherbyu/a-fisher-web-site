import { InputProps } from '../input-props.types';

export type NumberInputProps = InputProps<number> & {
    min?: number;
    max?: number;
};
