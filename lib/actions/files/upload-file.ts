import { createClient } from '@/lib';

type UploadFileProps = {
    file: File;
    filePath: string;
};

export async function uploadFile({ file, filePath }: UploadFileProps): Promise<{
    file: File;
    path: string;
}> {
    // Init Supabase Client
    const supabase = createClient();

    // Upload File to Supabase
    const BUCKET_NAME = process.env.BUCKET_NAME!;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);
    if (error) {
        console.log('Error Uploading File');
        throw error;
    } else {
        return { file: file, path: data.path };
    }
}
