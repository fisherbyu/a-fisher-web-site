type FormInputProps = {
    type: 'text' | 'number' | 'password' | 'email';
    className?: string;
    [key: string]: any; // This allows any other props to be passed
};
export const FormInput = ({ type, className, ...props }: FormInputProps) => {
    const baseClasses =
        'px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

    return <input type={type} className={`${baseClasses} ${className}`} {...props} />;
};
