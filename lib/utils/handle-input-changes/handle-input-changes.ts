export const HandleInputChanges = <T extends Record<string, any>>(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    currentData: T,
    onChange: (data: T) => void
) => {
    // Extract Data from Input
    const { name, value, type, checked } = e.target as HTMLInputElement;
    let parsedValue: string | number | boolean | undefined = value;

    // Handle different input types
    if (type === 'number') {
        parsedValue = value === '' ? undefined : Number(value);
    } else if (type === 'checkbox') {
        parsedValue = checked;
    }

    // Update Data
    const updatedData: T = {
        ...currentData,
        [name]: parsedValue,
    };

    // Process Updates using callback
    onChange(updatedData);
};
