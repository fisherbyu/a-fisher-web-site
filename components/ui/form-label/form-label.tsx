import { FormLabelProps } from './form-label.types';

export const FormLabel = ({ id, title }: FormLabelProps) => {
    return (
        <label htmlFor={id} className="font-medium text-gray-700 mb-2">
            {title}
        </label>
    );
};
