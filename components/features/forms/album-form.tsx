'use client';
import { Button, Divider } from 'thread-ui';
import { AlbumInfoData, AlbumInfoForm } from './album-info-form';
import { Album, AlbumInput } from '@/types';
import { useState } from 'react';
import { FileUpload } from '@/components';
import { LinkData, LinkForm } from './link-form';
import { ContentData, ContentsForm, fromContentData, toContentData } from './contents-form';
import { createAlbum, getPublicUrl, joinList, splitList, uploadImage } from '@/lib';
import { FileWithAlt } from '@/components/ui/form-elements/file-upload/file-upload.types';
import { ImageDisplay } from '@/components/ui/form-elements/file-upload/previews';

type FormProps = {
    artistId: number;
    initialData?: Album;
    onSuccess?: (album: Album) => void;
};

export const AlbumForm = ({ artistId, initialData, onSuccess }: FormProps) => {
    // Extract or Init Data
    // Album Info
    const [albumInfo, setAlbumInfo] = useState<AlbumInfoData>({
        title: initialData?.title ?? '',
        releaseDate: initialData?.releaseDate?.toISOString().slice(0, 10) ?? '',
        favoriteTracks: joinList(initialData?.favoriteTracks ?? []),
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
    const [files, setFiles] = useState<FileWithAlt[]>([]);
    const [replaceImage, setReplaceImage] = useState(false);

    // Submission
    const handleSubmit = async () => {
        // Edit Album
        if (initialData) {
            console.log(initialData);
            return;
        }

        // Create Album (image required)
        const file = files[0];
        if (!file) return;

        try {
            const uploaded = await uploadImage({
                file: file,
                alt: file.alt || '',
                filePath: 'music/album/',
            });

            const input: AlbumInput = {
                title: albumInfo.title,
                releaseDate: albumInfo.releaseDate ? new Date(albumInfo.releaseDate) : undefined,
                artistId,
                contents: fromContentData(contents),
                favoriteTracks: splitList(albumInfo.favoriteTracks),
                link,
                // Pick fields explicitly so extra upload metadata never reaches Prisma
                image: {
                    src: uploaded.src,
                    alt: uploaded.alt,
                    height: uploaded.height,
                    width: uploaded.width,
                },
                genres: splitList(albumInfo.genres).map((name) => ({ name })),
            };

            const album = await createAlbum(input);
            onSuccess?.(album);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Album</div>
            <Divider width="100%" />
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                <div>
                    <AlbumInfoForm data={albumInfo} onChange={setAlbumInfo} />
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
                            name="image"
                            allowedFileTypes={['image/*']}
                            supportedFormatsText="Supports all Image Types"
                            files={files}
                            setFiles={setFiles}
                            maxNumberFiles={1}
                            size="md"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-row justify-end">
                <Button margin="0px" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </form>
    );
};
