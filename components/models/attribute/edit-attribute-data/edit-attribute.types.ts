export type EditAttributeDataProps = {
    title: string;
    text: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
};
