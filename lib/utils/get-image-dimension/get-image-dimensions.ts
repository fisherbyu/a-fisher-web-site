export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        // Check if Image File
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            // Get dimensions
            const width = img.width;
            const height = img.height;

            // Clean up object URL to prevent memory leaks
            URL.revokeObjectURL(objectUrl);

            resolve({ width, height });
        };

        img.onerror = () => {
            // Clean up and reject if there's an error
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image'));
        };

        // Set source to load the image
        img.src = objectUrl;
    });
}
