export type FileUploadProps = {
    title?: string;
    files: FileWithAlt[];
    setFiles: (files: FileWithAlt[]) => Promise<void> | void;
    allowedFileTypes?: string[];
    maxFileSize?: number; // in bytes
    maxNumberFiles?: number;
    supportedFormatsText?: string;
};

export type FileWithAlt = File & {
    alt?: string;
};
