'use client';
import Image, { StaticImageData } from 'next/image';
import { ReactNode, useState } from 'react';
import { Lightbox, MasonryLayout, MediaOverlay } from 'thread-ui';

type PhotosContentsProps = {
    photos: { src: StaticImageData; alt: string; info?: ReactNode }[];
};

export default function PhotosContents({ photos }: PhotosContentsProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const masonryItems: ReactNode[] = [];
    const lightboxItems: ReactNode[] = [];
    const lightboxTrackItems: ReactNode[] = [];

    photos.forEach((photo, index) => {
        const openLightbox = () => {
            setSelectedIndex(index);
            setIsLightboxOpen(true);
        };

        const masonryPhoto = (
            <Image
                key={index}
                style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                placeholder="blur"
                src={photo.src}
                alt={photo.alt}
                role="button"
                tabIndex={0}
                onClick={openLightbox}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox();
                    }
                }}
                className="hover:cursor-pointer"
            />
        );
        const masonryItem = photo.info ? (
            <MediaOverlay key={index} overlay={photo.info}>
                {masonryPhoto}
            </MediaOverlay>
        ) : (
            masonryPhoto
        );

        const trackItem = (
            <Image
                key={index}
                placeholder="blur"
                src={photo.src}
                alt={photo.alt}
                height={60}
                width={0}
                sizes="60px"
                style={{ width: 'auto' }}
            />
        );

        const fullPhoto = <Image key={index} placeholder="blur" src={photo.src} alt={photo.alt} />;
        const lightboxItem = photo.info ? (
            <MediaOverlay key={index} overlay={photo.info}>
                {fullPhoto}
            </MediaOverlay>
        ) : (
            fullPhoto
        );

        masonryItems.push(masonryItem);
        lightboxItems.push(lightboxItem);
        lightboxTrackItems.push(trackItem);
    });

    return (
        <>
            <MasonryLayout items={masonryItems} container />
            <Lightbox
                startIndex={selectedIndex}
                items={lightboxItems}
                trackItems={lightboxTrackItems}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                variableWidths={true}
            />
        </>
    );
}
