export type InputProps<T> = {
    id?: string;
    name: string;
    title?: string;
    value?: T;
    required?: boolean;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};
