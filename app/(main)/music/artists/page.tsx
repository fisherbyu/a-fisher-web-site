import type { Metadata } from 'next';
import MusicDisplay from '@/components/old/ui/music-display';
import MusicDisplayPage from '@/components/old/ui/music/display-music-page';
import PageTitle from '@/components/old/ui/page-title';

import { useEffect, useState } from 'react';
import { getData, DataType } from '@/api/dataAccess';
import { Imprima } from 'next/font/google';
import ArtistContents from './contents';

const title: { title: string; subtitle?: string; center?: boolean } = {
    title: 'My Favorite Artists',
    subtitle: 'Check out some of my Favorite Artists',
    center: true,
};

export default function ArtistPage() {
    return (
        <main>
            <PageTitle components={title} />
            <ArtistContents />
        </main>
    );
}

export let metadata: Metadata = {
    title: 'My Favorite Artists',
};
