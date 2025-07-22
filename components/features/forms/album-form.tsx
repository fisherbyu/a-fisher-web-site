'use client';
import { Button, Divider } from 'thread-ui';
import { AlbumInfoData, AlbumInfoForm } from './album-info-form';
import { Album, AlbumDto, Attribute, AttributeDto, Content, ContentDto, Image, ImageDto, Link, LinkDto } from '@/types';
import { useId, useState } from 'react';
import { FileUpload } from '@/components';
import { LinkForm } from './link-form';
import { ContentsForm } from './contents-form';
import { AttributesForm } from '@/components';
// import { createArtist } from '@/lib';
import { getPublicUrl, uploadImage } from '@/lib';
import { FileWithAlt } from '@/components/ui/form-elements/file-upload/file-upload.types';
import { ImageDisplay } from '@/components/ui/form-elements/file-upload/previews';

type FormProps = {
    initialData?: Album;
    onSucess?: (album: Album) => void;
};

export const AlbumForm = ({ initialData, onSucess }: FormProps) => {
    // Extract or Init Data
    // Album Info
    const [albumInfo, setAlbumInfo] = useState<AlbumInfoData>({
        name: initialData?.name || '',
        rank: initialData?.rank,
    });

    // Contents
    const [contents, setContents] = useState<Array<Content | ContentDto>>(initialData?.contents || []);
    const addContent = () => {
        const newContent: ContentDto = {
            id: crypto.randomUUID(),
            text: '',
            order: contents.length,
        };
        setContents([...contents, newContent]);
    };

    // Attributes
    const [attributes, setAttributes] = useState<Array<Attribute | AttributeDto>>(initialData?.attributes || []);
    const addAttribute = () => {
        const newAttribute: AttributeDto = {
            id: crypto.randomUUID(),
            title: '',
            text: '',
            order: attributes.length,
        };
        setAttributes([...attributes, newAttribute]);
    };

    // Link
    const [link, setLink] = useState<Link | LinkDto>(initialData?.link || { id: useId(), appleURI: '', spotifyURI: '' });

    // Image
    const [image, setImage] = useState<Image | ImageDto>(initialData?.image || { id: useId(), src: '', alt: '', height: 0, width: 0 });
    const [files, setFiles] = useState<FileWithAlt[]>([]);
    const [replaceImage, setReplaceImage] = useState(false);

    return (
        <form className="container">
            <div className="text-3xl">{initialData ? 'Edit' : 'Create'} Album</div>
            <Divider width="100%" />
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                <div>
                    <AlbumInfoForm data={albumInfo} onChange={setAlbumInfo} />
                    <LinkForm data={link} onChange={setLink} />
                    {image && !replaceImage ? (
                        <div className="mt-3">
                            <ImageDisplay
                                src={getPublicUrl(image.src)}
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
                <div className="flex flex-col gap-3">
                    <AttributesForm data={attributes} onChange={setAttributes} onAdd={addAttribute} />
                    <ContentsForm data={contents} onChange={setContents} onAdd={addContent} />
                </div>
            </div>
            <div className="flex flex-row justify-end">
                <Button margin="0px">Submit</Button>
            </div>
        </form>
    );
};
