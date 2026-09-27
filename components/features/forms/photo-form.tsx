'use client';
import { useState } from 'react';
import { Button, Dropdown, FileUpload, FileUploadItem, TextInput, UploadableFile } from 'thread-ui';
import { Photo } from '@/types';
import { getAssetSrc, joinList, useRefresh, useSaveAction } from '@/lib';
import { deletePhotoAction, updatePhotoAction } from '@/server/data/photo.actions';

type PhotoFormProps = {
    initialData: Photo;
    /** Called after a successful save, e.g. to close a modal */
    onSaved?: () => void;
    /** Shows a Cancel button that calls this, e.g. to close a modal without saving */
    onCancel?: () => void;
    /** Called after the photo is deleted, e.g. to close a modal */
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
 * <PhotoForm initialData={photo} onSaved={close} onCancel={close} onDeleted={close} />
 */
export const PhotoForm = ({ initialData, onSaved, onCancel, onDeleted }: PhotoFormProps) => {
    const { id, asset } = initialData;
    const [state, formAction, pending] = useSaveAction(updatePhotoAction.bind(null, id), {
        refresh: ['/api/photo'],
        onSaved: () => onSaved?.(),
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
        <form className="flex flex-col gap-2 w-full" action={handleAction}>
            {state.message && <div className="text-red-500">{state.message}</div>}
            {deleteError && <div className="text-red-500">{deleteError}</div>}
            <TextInput
                name="title"
                title="Title"
                size="sm"
                defaultValue={initialData.title}
                error={errors?.title?.[0]}
                required
            />
            <TextInput
                name="caption"
                title="Caption"
                size="sm"
                defaultValue={initialData.caption ?? ''}
                error={errors?.caption?.[0]}
                multiline
            />
            {/* Short fields pair up to keep the form within the viewport */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <TextInput
                    name="location"
                    title="Location"
                    size="sm"
                    defaultValue={initialData.location ?? ''}
                    error={errors?.location?.[0]}
                    placeholder="Arches National Park, Utah"
                />
                <TextInput
                    name="camera"
                    title="Camera"
                    size="sm"
                    defaultValue={initialData.camera ?? ''}
                    error={errors?.camera?.[0]}
                />
                <TextInput
                    name="takenAt"
                    title="Date Taken"
                    size="sm"
                    defaultValue={toDateValue(initialData.takenAt)}
                    error={errors?.takenAt?.[0]}
                    placeholder="YYYY-MM-DD"
                />
                <Dropdown
                    name="published"
                    title="Status"
                    size="sm"
                    defaultValue={String(initialData.published)}
                    options={STATUS_OPTIONS}
                />
            </div>
            <TextInput
                name="tags"
                title="Tags"
                size="sm"
                defaultValue={joinList(initialData.tags.map(({ name }) => name))}
                error={errors?.tags?.[0]}
                placeholder="Landscape, Utah"
            />
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
                size="sm"
            />
            {imageError && <div className="text-red-500">{imageError}</div>}
            {errors?.image && <div className="text-red-500">{errors.image[0]}</div>}
            <div className="flex flex-row items-center justify-between gap-3 pt-2">
                <Button margin="0px" color="error" disabled={busy} onClick={handleDelete}>
                    {deleting ? 'Deleting…' : 'Delete'}
                </Button>
                <div className="flex flex-row items-center gap-3">
                    {onCancel && (
                        <Button margin="0px" color="info" text disabled={busy} onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button margin="0px" type="submit" disabled={busy}>
                        {pending ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </div>
        </form>
    );
};
