export const getPublicUrl = (filePath: string) => {
    const BASE_PUBLIC_SRC = process.env.NEXT_PUBLIC_BASE_SRC;

    return BASE_PUBLIC_SRC + filePath;
};
