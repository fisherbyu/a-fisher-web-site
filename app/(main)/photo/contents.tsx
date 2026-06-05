'use client';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import { Lightbox, MasonryLayout } from 'thread-ui';

type PhotosContentsProps = {
    photos: { src: StaticImageData; alt: string }[];
};

export default function PhotosContents({ photos }: PhotosContentsProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const masonryItems = photos.map((photo, index) => {
        const openLightbox = () => {
            setSelectedIndex(index);
            setIsLightboxOpen(true);
        };

        return (
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
    });

    const lightboxItems = photos.map((photo, index) => (
        <Image key={index} placeholder="blur" src={photo.src} alt={photo.alt} />
    ));

    return (
        <>
            <MasonryLayout items={masonryItems} container />
            <Lightbox
                startIndex={selectedIndex}
                items={lightboxItems}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                variableWidths={true}
            />
        </>
    );
}
