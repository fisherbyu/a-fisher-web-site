import type { Metadata } from 'next';

// Import Content
import content from '@/api/static_content/albums.json';
import { PageHeader } from '@/.yalc/thread-ui/dist';
import { MusicCard } from '@/components/features/music-card/music-card';

export default function ColdplayPage() {
    return (
        <main>
            <PageHeader title="Coldplay Albums" caption="My review of each Coldplay Album" center />
            <section className="container">
                {content.map((album, index) => (
                    // <MusicCard key={index} item={album} type="album" />
                    <></>
                ))}
                <br />
            </section>
        </main>
    );
}

export let metadata: Metadata = {
    title: 'Coldplay Albums',
};
