'use client';
import { Button, FileUpload, FileUploadItem, TextInput, UploadableFile } from 'thread-ui';
import { AlbumInfoForm } from './album-info-form';
import { Album } from '@/types';
import { useState } from 'react';
import { LinkForm } from './link-form';
import { ContentData, ContentsForm, fromContentData, toContentData } from './contents-form';
import { getAssetSrc, joinList, useSaveAction } from '@/lib';
import { createAlbumAction, updateAlbumAction } from '@/server/data/album.actions';

const toDateValue = (value?: string | Date | null) => {
    if (!value) return '';

    return value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10);
};

type FormProps = {
    /** Artist this album belongs to; bound server-side, never read from the DOM */
    artistId: number;
    /** Existing album to edit; omit to create a new one */
    initialData?: Album;
    /** Called with the record's id after a successful save */
    onSaved?: (id: number) => void;
};

// Upload preview is a small thumbnail
const PREVIEW_WIDTH = 320;

const isNewFile = (item: FileUploadItem): item is UploadableFile => item instanceof File;

/**
 * Create/edit form for an Album. Submits through a Server Action, so every
 * field is read from the DOM as `FormData` rather than assembled by hand.
 * A newly picked image file is added to the form data and processed
 * server-side by the action.
 *
 * @example
 * <AlbumForm artistId={artist.id} />
 *
 * @example
 * <AlbumForm artistId={artist.id} initialData={album} />
 */
export const AlbumForm = ({ artistId, initialData, onSaved }: FormProps) => {
    // Bind ids server-side so they can't be swapped by the client
    const action = initialData
        ? updateAlbumAction.bind(null, initialData.id)
        : createAlbumAction.bind(null, artistId);
    const [state, formAction, pending] = useSaveAction(action, {
        refresh: ['/api/album', '/api/artist'],
        onSaved,
    });

    // Contents
    const [contents, setContents] = useState<ContentData[]>(() =>
        toContentData(initialData?.contents ?? [])
    );
    const addContent = () => {
        const newContent: ContentData = {
            id: crypto.randomUUID(),
            text: '',
            order: contents.length,
        };
        setContents([...contents, newContent]);
    };

    // Image (existing image on edit shows as a remote file; new uploads are `File`s)
    const existingImage = initialData?.image;
    const [files, setFiles] = useState<FileUploadItem[]>(() =>
        existingImage
            ? [
                  {
                      id: existingImage.key,
                      src: getAssetSrc(existingImage, PREVIEW_WIDTH),
                      name: existingImage.name,
                      alt: existingImage.alt,
                  },
              ]
            : []
    );

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

    return (
        <form className="flex flex-col gap-4 w-full" action={handleAction}>
            {state.message && <div className="text-red-500">{state.message}</div>}
            <div className="grid gap-x-10 gap-y-4 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
                <div className="flex flex-col gap-2">
                    <TextInput
                        name="title"
                        title="Title"
                        defaultValue={initialData?.title ?? ''}
                        required
                    />
                    <TextInput
                        name="releaseDate"
                        title="Release Date"
                        defaultValue={toDateValue(initialData?.releaseDate)}
                        placeholder="YYYY-MM-DD"
                        required
                    />
                    <TextInput
                        name="favoriteTracks"
                        title="Favorite Tracks"
                        defaultValue={joinList(initialData?.favoriteTracks ?? [])}
                        placeholder="Yellow, Spies, Trouble"
                        required
                    />
                    <TextInput
                        name="genres"
                        title="Genres"
                        defaultValue={joinList(initialData?.genres.map(({ name }) => name) ?? [])}
                        placeholder="Alternative, Rock"
                    />
                    <LinkForm initialData={initialData?.link} />
                </div>
                <div className="flex flex-col gap-3">
                    <ContentsForm data={contents} onChange={setContents} onAdd={addContent} />
                    {/* No `name`: the action reads the file set in `handleAction`, not the input's own value */}
                    <FileUpload
                        title="Image"
                        emptyTitle="Add Image"
                        accept="image/*"
                        supportedFormatsText="Supports all Image Types"
                        value={files}
                        onChange={setFiles}
                        maxFiles={1}
                        required
                        size="md"
                    />
                    {imageError && <div className="text-red-500">{imageError}</div>}
                    {state.errors?.image && (
                        <div className="text-red-500">{state.errors.image[0]}</div>
                    )}
                </div>
            </div>
            {/* Paragraphs ride along as repeated fields; the action reads them in order */}
            {fromContentData(contents).map((text, index) => (
                <input key={index} type="hidden" name="contents" value={text} />
            ))}
            <div className="flex flex-row justify-end">
                <Button margin="0px" type="submit" disabled={pending}>
                    {pending ? 'Saving…' : 'Submit'}
                </Button>
            </div>
        </form>
    );
};
