'use client';
import { useState } from 'react';
import { Button, Dropdown, FileUpload, FileUploadItem, TextInput, UploadableFile } from 'thread-ui';
import { Photo } from '@/types';
import { getAssetSrc, joinList, useRefresh, useSaveAction } from '@/lib';
import { deletePhotoAction, updatePhotoAction } from '@/server/data/photo.actions';

type PhotoFormProps = {
    initialData: Photo;
    /** Called after the photo is deleted, e.g. to clear the selection */
    onDeleted?: () => void;
};

// Upload preview is a small thumbnail
const PREVIEW_WIDTH = 640;

const STATUS_OPTIONS = [
    { label: 'Draft', value: 'false' },
    { label: 'Published', value: 'true' },
];

const isNewFile = (item: FileUploadItem): item is UploadableFile => item instanceof File;

/** Normalizes a stored date to the `YYYY-MM-DD` shape the input expects */
const toDateValue = (value?: string | Date | null) => {
    if (!value) return '';

    return value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10);
};

/**
 * Edit form for a Photo: details, tags, publish status, and an optional replacement file.
 * Submits through a Server Action; a newly picked file rides along in the form data.
 * New photos are created by `PhotoUploadForm`, so this form always edits.
 *
 * @example
 * <PhotoForm initialData={photo} onDeleted={() => select(null)} />
 */
export const PhotoForm = ({ initialData, onDeleted }: PhotoFormProps) => {
    const { id, asset } = initialData;
    const [state, formAction, pending] = useSaveAction(updatePhotoAction.bind(null, id), {
        refresh: ['/api/photo'],
    });
    const refresh = useRefresh(['/api/photo']);

    // Image (the stored file shows as a remote file; a replacement is a `File`)
    const [files, setFiles] = useState<FileUploadItem[]>([
        { id: asset.key, src: getAssetSrc(asset, PREVIEW_WIDTH), name: asset.name, alt: asset.alt },
    ]);
    const [imageError, setImageError] = useState<string>();

    // Submission
    const handleAction = (formData: FormData) => {
        setImageError(undefined);

        // `required` on the upload covers this natively; kept as a guard
        const current = files[0];
        if (!current) {
            setImageError('An image is required.');
            return;
        }

        // A new file rides along to be processed server-side; without one the stored image is kept
        const file = files.find(isNewFile);
        if (file) formData.set('image', file);
        formData.set('imageAlt', current.alt ?? '');

        formAction(formData);
    };

    // Deletion
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string>();

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${initialData.title}"? This removes its files too.`)) return;

        setDeleting(true);
        setDeleteError(undefined);
        const result = await deletePhotoAction(id);
        setDeleting(false);

        if (!result.ok) {
            setDeleteError(result.message);
            return;
        }
        refresh();
        onDeleted?.();
    };

    const errors = state.errors;
    const busy = pending || deleting;

    return (
        <form className="flex flex-col gap-4 w-full" action={handleAction}>
            {state.message && <div className="text-red-500">{state.message}</div>}
            {deleteError && <div className="text-red-500">{deleteError}</div>}
            <div className="grid gap-x-10 gap-y-4 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
                <div className="flex flex-col gap-2">
                    <TextInput
                        name="title"
                        title="Title"
                        defaultValue={initialData.title}
                        error={errors?.title?.[0]}
                        required
                    />
                    <TextInput
                        name="caption"
                        title="Caption"
                        defaultValue={initialData.caption ?? ''}
                        error={errors?.caption?.[0]}
                        multiline
                    />
                    <TextInput
                        name="location"
                        title="Location"
                        defaultValue={initialData.location ?? ''}
                        error={errors?.location?.[0]}
                        placeholder="Arches National Park, Utah"
                    />
                    <TextInput
                        name="camera"
                        title="Camera"
                        defaultValue={initialData.camera ?? ''}
                        error={errors?.camera?.[0]}
                    />
                    <TextInput
                        name="takenAt"
                        title="Date Taken"
                        defaultValue={toDateValue(initialData.takenAt)}
                        error={errors?.takenAt?.[0]}
                        placeholder="YYYY-MM-DD"
                    />
                    <TextInput
                        name="tags"
                        title="Tags"
                        defaultValue={joinList(initialData.tags.map(({ name }) => name))}
                        error={errors?.tags?.[0]}
                        placeholder="Landscape, Utah"
                    />
                    <Dropdown
                        name="published"
                        title="Status"
                        defaultValue={String(initialData.published)}
                        options={STATUS_OPTIONS}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    {/* No `name`: the action reads the file set in `handleAction`, not the input's own value */}
                    <FileUpload
                        title="Image"
                        emptyTitle="Replace Image"
                        accept="image/*"
                        supportedFormatsText="Supports all Image Types"
                        value={files}
                        onChange={setFiles}
                        maxFiles={1}
                        required
                        size="md"
                    />
                    {imageError && <div className="text-red-500">{imageError}</div>}
                    {errors?.image && <div className="text-red-500">{errors.image[0]}</div>}
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <Button margin="0px" type="submit" disabled={busy}>
                    {pending ? 'Saving…' : 'Save'}
                </Button>
                <Button margin="0px" color="error" text disabled={busy} onClick={handleDelete}>
                    {deleting ? 'Deleting…' : 'Delete'}
                </Button>
            </div>
        </form>
    );
};
