import { InputProps } from '../input-props.types';

export type NumberInputProps = InputProps<number> & {
    dark?: boolean;
    min?: number;
    max?: number;
};
