export type TextInputProps = {
    id?: string;
    name: string;
    title: string;
    value?: string;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};
