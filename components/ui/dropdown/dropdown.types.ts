export type DropdownProps {
    label?: string;
    value: string | number;
    options: DropdownOption[];
    onSelect: (value: string | number) => void;
}

export type DropdownOption {
    label: string;
    value: string | number;
}
