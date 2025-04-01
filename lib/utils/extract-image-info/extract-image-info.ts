export const extractImageInfo = (file: File): Promise<{ fileName: string; height: number; width: number }> => {
    return new Promise((resolve, reject) => {
        const fileName = file.name;
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            // Extract Dimensions
            const width = img.width;
            const height = img.height;

            // Clean up
            URL.revokeObjectURL(objectUrl);

            // Resolve
            resolve({
                fileName,
                width,
                height,
            });
        };

        img.onerror = () => {
            // Clean up
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to Load Image'));
        };

        // Set Source and Load Image
        img.src = objectUrl;
    });
};
