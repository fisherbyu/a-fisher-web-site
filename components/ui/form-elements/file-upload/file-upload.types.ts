export type FileUploadProps = {
    title?: string;
    name: string;
    files: FileWithAlt[];
    setFiles: (files: FileWithAlt[]) => Promise<void> | void;
    allowedFileTypes?: string[];
    maxFileSize?: number; // in bytes
    maxNumberFiles?: number;
    supportedFormatsText?: string;
    required?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

export type FileWithAlt = File & {
    alt?: string;
};
