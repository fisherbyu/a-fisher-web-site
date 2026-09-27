'use client';
import { useState } from 'react';
import { Button, FileUpload, FileUploadItem, UploadableFile } from 'thread-ui';
import { useRefresh } from '@/lib';
import { uploadPhotoAction } from '@/server/data/photo.actions';

type PhotoUploadFormProps = {
    /** Called with the first new photo's id once uploads finish */
    onCreated?: (id: number) => void;
};

// Enough for a shoot's worth of picks; each file is still its own request
const MAX_FILES = 50;

const isNewFile = (item: FileUploadItem): item is UploadableFile => item instanceof File;

/**
 * Uploads several photos as unpublished drafts. Files are sent one at a time, so each
 * request stays under the body size limit and progress can be shown. Titles come from
 * file names and camera/date from EXIF; edit each draft afterwards to publish it.
 * Files that fail stay in the list with their error so they can be retried.
 *
 * @example
 * <PhotoUploadForm onCreated={select} />
 */
export const PhotoUploadForm = ({ onCreated }: PhotoUploadFormProps) => {
    const refresh = useRefresh(['/api/photo']);
    const [files, setFiles] = useState<FileUploadItem[]>([]);
    const [progress, setProgress] = useState<{ done: number; total: number }>();
    const [failures, setFailures] = useState<{ name: string; message: string }[]>([]);

    const upload = async () => {
        const queue = files.filter(isNewFile);
        const failed: typeof failures = [];
        const failedFiles: FileUploadItem[] = [];
        let firstId: number | undefined;

        setFailures([]);
        for (const [index, file] of queue.entries()) {
            setProgress({ done: index, total: queue.length });

            const formData = new FormData();
            formData.set('image', file);
            const result = await uploadPhotoAction(formData);

            if (result.ok) {
                firstId ??= result.id;
            } else {
                failed.push({ name: file.name, message: result.message });
                failedFiles.push(file);
            }
        }
        setProgress(undefined);

        // Keep only the failures, so a retry doesn't re-upload what already went through
        setFiles(failedFiles);
        setFailures(failed);
        if (firstId !== undefined) {
            refresh();
            onCreated?.(firstId);
        }
    };

    const uploading = progress !== undefined;

    return (
        <div className="flex flex-col gap-4 w-full max-w-2xl">
            <FileUpload
                title="Photos"
                emptyTitle="Add Photos"
                accept="image/*"
                supportedFormatsText="Supports all Image Types, up to 30MB each"
                value={files}
                onChange={setFiles}
                maxFiles={MAX_FILES}
                editMode="none"
                disabled={uploading}
                size="md"
            />
            {failures.length > 0 && (
                <ul className="text-red-500">
                    {failures.map(({ name, message }) => (
                        <li key={name}>
                            {name}: {message}
                        </li>
                    ))}
                </ul>
            )}
            <div>
                <Button margin="0px" onClick={upload} disabled={uploading || files.length === 0}>
                    {uploading
                        ? `Uploading ${progress.done + 1} of ${progress.total}…`
                        : `Upload${files.length > 1 ? ` ${files.length} Photos` : ''}`}
                </Button>
            </div>
            <p className="text-sm text-gray-500">
                Uploads are saved as drafts, titled from their file names. Open each one to add
                details and publish it.
            </p>
        </div>
    );
};
