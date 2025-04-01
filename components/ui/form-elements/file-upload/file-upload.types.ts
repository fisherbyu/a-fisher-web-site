export type FileUploadProps = {
    title?: string;
    allowedFileTypes?: string[];
    maxFileSize?: number; // in bytes
    onFileSelect: (file: File) => Promise<void> | void;
    supportedFormatsText?: string;
    initialFileName?: string;
};
