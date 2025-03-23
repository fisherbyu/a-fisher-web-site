import type { Metadata } from 'next';
import MusicDisplay from '@/components/old/ui/music-display';
import PageTitle from '@/components/old/ui/page-title';

// Import Content
import content from '@/api/static_content/albums.json';

const title: { title: string; subtitle?: string; center?: boolean } = {
    title: 'Coldplay Albums',
    subtitle: 'My review of each Coldplay Album',
    center: true,
};

export default function ColdplayPage() {
    return (
        <main>
            <PageTitle components={title} />
            <section className="container">
                {content.map((album, index) => (
                    <MusicDisplay key={album.name} index={index} components={album} />
                ))}
                <br />
            </section>
        </main>
    );
}

export let metadata: Metadata = {
    title: 'Coldplay Albums',
};
