import { FormInputProps } from './form-input.types';

export const FormInput = ({ type, className, ...props }: FormInputProps) => {
    const baseClasses =
        'px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

    return <input type={type} className={`${baseClasses} ${className}`} {...props} />;
};
