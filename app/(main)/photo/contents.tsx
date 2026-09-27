'use client';
import { ReactNode, useState } from 'react';
import { Lightbox, MasonryLayout, MediaOverlay, SkeletonLayoutLoader, Text } from 'thread-ui';
import { usePhotos } from '@/lib';
import type { Photo } from '@/types';
import { AssetImage, LoadingError } from '@/components';

export default function PhotosContents() {
    const { photos, isLoading, error } = usePhotos();
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (error) {
        return <LoadingError />;
    }

    if (isLoading || !photos) {
        return <SkeletonLayoutLoader mdcol={3} itemConfig={{ h: '300px', w: '100%' }} />;
    }

    const masonryItems: ReactNode[] = [];
    const lightboxItems: ReactNode[] = [];
    const lightboxTrackItems: ReactNode[] = [];

    photos.forEach((photo, index) => {
        const openLightbox = () => {
            setSelectedIndex(index);
            setIsLightboxOpen(true);
        };

        const masonryPhoto = (
            <AssetImage
                key={photo.id}
                asset={photo.asset}
                style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                sizes="(max-width: 768px) 100vw, 33vw"
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
        const masonryItem = masonryPhoto;

        const trackItem = (
            <AssetImage
                key={photo.id}
                asset={photo.asset}
                sizes="60px"
                style={{ height: 60, width: 'auto' }}
            />
        );

        const fullPhoto = <AssetImage key={photo.id} asset={photo.asset} sizes="100vw" />;
        const lightboxItem = (
            <MediaOverlay key={photo.id} overlay={<PhotoInfo photo={photo} />}>
                {fullPhoto}
            </MediaOverlay>
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

/** Lightbox overlay: title, optional caption, then camera · location · date */
const PhotoInfo = ({ photo }: { photo: Photo }) => {
    const takenAt = photo.takenAt
        ? new Date(photo.takenAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC',
          })
        : undefined;
    const details = [photo.camera, photo.location, takenAt].filter(Boolean).join(' · ');

    return (
        <div className="flex flex-col gap-1">
            <Text color="white" weight="semibold" marginBottom={false}>
                {photo.title}
            </Text>
            {photo.caption && (
                <Text color="white" marginBottom={false}>
                    {photo.caption}
                </Text>
            )}
            {details && (
                <Text color="white" size="sm" marginBottom={false}>
                    {details}
                </Text>
            )}
        </div>
    );
};
