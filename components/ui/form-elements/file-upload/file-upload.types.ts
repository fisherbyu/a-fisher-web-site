export type FileUploadProps = {
    title?: string;
    allowedFileTypes?: string[];
    maxFileSize?: number; // in bytes
    onFileSelect: (file: File, customFilename: string) => Promise<void> | void;
    supportedFormatsText?: string;
    initialFileName?: string;
};
