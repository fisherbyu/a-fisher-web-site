import { InputProps } from '../input-props.types';

export type TextInputProps = InputProps<string> & {
    multiline?: boolean;
};
