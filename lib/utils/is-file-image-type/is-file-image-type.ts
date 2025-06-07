export const isFileImageType = (file: File): boolean => {
    return file.type.startsWith('image/');
};
