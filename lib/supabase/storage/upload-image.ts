import { createClient, getImageDimensions } from '@/lib';
import { ImageUpload } from '@/types';
import { uploadFile } from '@/lib';

type UploadImageProps = {
    file: File;
    alt: string;
    filePath: string;
};

export async function uploadImage({
    file,
    alt,
    filePath,
}: UploadImageProps): Promise<ImageUpload> {
    try {
        // Upload File
        const uploadResult = await uploadFile({ file, filePath });

        // Get Image Dimensions
        const { height, width } = await getImageDimensions(file);

        return {
            src: uploadResult.path,
            alt: alt,
            height: height,
            width: width,
        };
    } catch (error) {
        throw error;
    }
}
