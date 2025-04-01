import { FormLabelProps } from './form-label.types';

export const FormLabel = ({ name, id = name, title }: FormLabelProps) => {
    return (
        <label id={id} htmlFor={name} className="block font-medium text-gray-700 mb-2">
            {title}
        </label>
    );
};
