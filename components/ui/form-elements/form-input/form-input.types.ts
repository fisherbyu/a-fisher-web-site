export type FormInputProps = {
    type: 'text' | 'number' | 'password' | 'email';
    className?: string;
    [key: string]: any; // This allows any other props to be passed
};
