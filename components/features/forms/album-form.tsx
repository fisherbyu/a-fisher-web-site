'use client';
import { Button, Divider, FileUpload, ImageDisplay, UploadableFile } from 'thread-ui';
import { AlbumInfoForm } from './album-info-form';
import { Album, Image as ImageData } from '@/types';
import { useActionState, useState } from 'react';
import { LinkForm } from './link-form';
import { ContentData, ContentsForm, fromContentData, toContentData } from './contents-form';
import { getPublicUrl, uploadImage } from '@/lib';
import { createAlbumAction, updateAlbumAction } from '@/server/data/album.actions';

type FormProps = {
    /** Artist this album belongs to; bound server-side, never read from the DOM */
    artistId: number;
    /** Existing album to edit; omit to create a new one */
    initialData?: Album;
};

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

    // Image (existing image on edit; new uploads come from files)
    const existingImage = initialData?.image;
    const [files, setFiles] = useState<UploadableFile[]>([]);
    const [replaceImage, setReplaceImage] = useState(false);

    // Upload runs before the action dispatches, so it needs its own pending flag
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState<string>();
    const busy = uploading || pending;

    // Submission
    const handleAction = async (formData: FormData) => {
        setImageError(undefined);

        // Upload the new file if one was picked, otherwise reuse what's stored
        const file = files[0];
        let image: Omit<ImageData, 'id'> | undefined = existingImage;

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
                <div>
                    <AlbumInfoForm initialData={initialData} />
                    <LinkForm initialData={initialData?.link} />
                </div>
                <div className="flex flex-col gap-3">
                    <ContentsForm data={contents} onChange={setContents} onAdd={addContent} />
                    {existingImage && !replaceImage ? (
                        <div className="mt-3">
                            <ImageDisplay
                                src={getPublicUrl(existingImage.src)}
                                action={() => {
                                    setReplaceImage(true);
                                }}
                            />
                        </div>
                    ) : (
                        <FileUpload
                            title="Add Image"
                            name="imageFile"
                            allowedFileTypes={['image/*']}
                            supportedFormatsText="Supports all Image Types"
                            value={files}
                            onChange={setFiles}
                            maxNumberFiles={1}
                            size="md"
                        />
                    )}
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
