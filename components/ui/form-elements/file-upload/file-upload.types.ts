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
};

export type FileWithAlt = File & {
    alt?: string;
};
