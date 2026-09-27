import type { Metadata } from 'next';
import { PageHeader } from 'thread-ui';
import PhotosContents from './contents';

export default function PhotographyPage() {
    return (
        <>
            <PageHeader
                title="My Photography"
                description="Here are some of my photos I've taken over the years. I got interested in photography because my sister is an amazing photographer and I love capturing moments."
            />
            <PhotosContents />
        </>
    );
}

export let metadata: Metadata = {
    title: 'My Photography',
};
