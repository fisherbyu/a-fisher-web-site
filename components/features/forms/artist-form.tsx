'use client';
import { Button, Divider, FileUpload, UploadableFile } from 'thread-ui';
import { ArtistInfoData, ArtistInfoForm } from './artist-info-form';
import { Artist, ArtistInput } from '@/types';
import { useState } from 'react';
import { LinkData, LinkForm } from './link-form';
import { ContentData, ContentsForm, fromContentData, toContentData } from './contents-form';
import { createArtist } from '@/lib';
import { getPublicUrl, joinList, splitList, uploadImage } from '@/lib';
import { ImageDisplay } from '@/components/ui/form-elements/file-upload/previews';

type FormProps = {
    initialData?: Artist;
    onSuccess?: (artist: Artist) => void;
};

export const ArtistForm = ({ initialData, onSuccess }: FormProps) => {
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

    // Submission
    const handleSubmit = async () => {
        // Edit Artist
        if (initialData) {
            console.log(initialData);
            return;
        }

        // Create Artist (image required)
        const file = files[0];
        if (!file) return;

        try {
            const uploaded = await uploadImage({
                file: file,
                alt: file.alt || '',
                filePath: 'music/artists/',
            });

            const input: ArtistInput = {
                name: artistInfo.name,
                contents: fromContentData(contents),
                favoriteTracks: splitList(artistInfo.favoriteTracks),
                favoriteAlbums: splitList(artistInfo.favoriteAlbums),
                link,
                // Pick fields explicitly so extra upload metadata never reaches Prisma
                image: {
                    src: uploaded.src,
                    alt: uploaded.alt,
                    height: uploaded.height,
                    width: uploaded.width,
                },
                genres: splitList(artistInfo.genres).map((name) => ({ name })),
            };

            const artist = await createArtist(input);
            onSuccess?.(artist);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Artist</div>
            <Divider width="100%" />
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
                            name="image"
                            allowedFileTypes={['image/*']}
                            supportedFormatsText="Supports all Image Types"
                            value={files}
                            onChange={setFiles}
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
