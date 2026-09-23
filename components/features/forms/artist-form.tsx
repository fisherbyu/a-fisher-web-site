'use client';
import { Button, Divider, FileUpload, ImageDisplay, UploadableFile } from 'thread-ui';
import { ArtistInfoData, ArtistInfoForm } from './artist-info-form';
import { Artist, Image as ImageData } from '@/types';
import { useActionState, useState } from 'react';
import { LinkData, LinkForm } from './link-form';
import { ContentData, ContentsForm, fromContentData, toContentData } from './contents-form';
import { getPublicUrl, joinList, uploadImage } from '@/lib';
import { createArtistAction, updateArtistAction } from '@/server/data/artist.actions';

type FormProps = {
    /** Existing artist to edit; omit to create a new one */
    initialData?: Artist;
};

/**
 * Create/edit form for an Artist. Submits through a Server Action, so every
 * field is read from the DOM as `FormData` rather than assembled by hand.
 * The image is uploaded client-side on submit and passed along as hidden
 * metadata fields.
 *
 * @example
 * <ArtistForm />
 *
 * @example
 * <ArtistForm initialData={artist} />
 */
export const ArtistForm = ({ initialData }: FormProps) => {
    // Bind the id server-side on edit so it can't be swapped by the client
    const action = initialData ? updateArtistAction.bind(null, initialData.id) : createArtistAction;
    const [state, formAction, pending] = useActionState(action, {});

    // Extract or Init Data
    // Artist Info
    const [artistInfo, setArtistInfo] = useState<ArtistInfoData>({
        name: initialData?.name ?? '',
        favoriteTracks: joinList(initialData?.favoriteTracks ?? []),
        favoriteAlbums: joinList(initialData?.favoriteAlbums ?? []),
        genres: joinList(initialData?.genres.map(({ name }) => name) ?? []),
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

    // Link
    const [link, setLink] = useState<LinkData>({
        appleURI: initialData?.link.appleURI ?? '',
        spotifyURI: initialData?.link.spotifyURI ?? '',
    });

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
                    filePath: 'music/artists/',
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
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Artist</div>
            <Divider width="100%" />
            {state.message && <div className="text-red-500">{state.message}</div>}
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                <div>
                    <ArtistInfoForm data={artistInfo} onChange={setArtistInfo} />
                    <LinkForm data={link} onChange={setLink} />
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
