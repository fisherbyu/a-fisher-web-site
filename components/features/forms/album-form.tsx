'use client';
import { Button, Divider, FileUpload, FileUploadItem, TextInput, UploadableFile } from 'thread-ui';
import { AlbumInfoForm } from './album-info-form';
import { Album, Image as ImageData } from '@/types';
import { useActionState, useState } from 'react';
import { LinkForm } from './link-form';
import { ContentData, ContentsForm, fromContentData, toContentData } from './contents-form';
import { getPublicUrl, joinList, uploadImage } from '@/lib';
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
};

const isNewFile = (item: FileUploadItem): item is UploadableFile => item instanceof File;

/**
 * Create/edit form for an Album. Submits through a Server Action, so every
 * field is read from the DOM as `FormData` rather than assembled by hand.
 * The image is uploaded client-side on submit and passed along as hidden
 * metadata fields.
 *
 * @example
 * <AlbumForm artistId={artist.id} />
 *
 * @example
 * <AlbumForm artistId={artist.id} initialData={album} />
 */
export const AlbumForm = ({ artistId, initialData }: FormProps) => {
    // Bind ids server-side so they can't be swapped by the client
    const action = initialData
        ? updateAlbumAction.bind(null, initialData.id)
        : createAlbumAction.bind(null, artistId);
    const [state, formAction, pending] = useActionState(action, {});

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
                      id: existingImage.src,
                      src: getPublicUrl(existingImage.src),
                      name: existingImage.src.split('/').pop() ?? 'Current image',
                      alt: existingImage.alt,
                  },
              ]
            : []
    );

    // Upload runs before the action dispatches, so it needs its own pending flag
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState<string>();
    const busy = uploading || pending;

    // Submission
    const handleAction = async (formData: FormData) => {
        setImageError(undefined);

        // Upload the new file if one was picked, otherwise reuse what's stored if it wasn't removed
        const file = files.find(isNewFile);
        let image: Omit<ImageData, 'id'> | undefined = files.length > 0 ? existingImage : undefined;

        if (file) {
            setUploading(true);
            try {
                image = await uploadImage({
                    file: file,
                    alt: file.alt || '',
                    filePath: 'music/album/',
                });
            } catch (error) {
                console.error('Image upload failed:', error);
                setImageError('Could not upload the image. Please try again.');
                return;
            } finally {
                setUploading(false);
            }
        }

        // `required` on the upload covers this natively; kept as a type guard
        if (!image) {
            setImageError('An image is required.');
            return;
        }

        // Pick fields explicitly so extra upload metadata never reaches Prisma
        formData.set('imageSrc', image.src);
        formData.set('imageAlt', image.alt);
        formData.set('imageWidth', String(image.width));
        formData.set('imageHeight', String(image.height));

        formAction(formData);
    };

    return (
        <form className="container" action={handleAction}>
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Album</div>
            <Divider width="100%" />
            {state.message && <div className="text-red-500">{state.message}</div>}
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col gap-2 ">
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
                    />
                    <TextInput
                        name="favoriteTracks"
                        title="Favorite Tracks"
                        defaultValue={joinList(initialData?.favoriteTracks ?? [])}
                        placeholder="Yellow, Spies, Trouble"
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
                    {/* No `name`: the image uploads client-side, so the file must not ride along in FormData */}
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
                    {state.errors?.imageSrc && (
                        <div className="text-red-500">{state.errors.imageSrc[0]}</div>
                    )}
                </div>
            </div>
            {/* Paragraphs ride along as repeated fields; the action reads them in order */}
            {fromContentData(contents).map((text, index) => (
                <input key={index} type="hidden" name="contents" value={text} />
            ))}
            <div className="flex flex-row justify-end">
                <Button margin="0px" type="submit" disabled={busy}>
                    {busy ? 'Saving…' : 'Submit'}
                </Button>
            </div>
        </form>
    );
};
