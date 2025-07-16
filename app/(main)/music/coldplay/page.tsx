import type { Metadata } from 'next';

// Import Content
import content from '@/api/static_content/albums.json';
import { PageHeader } from '@/.yalc/thread-ui/dist';

export default function ColdplayPage() {
    return (
        <main>
            <PageHeader title="Coldplay Albums" caption="My review of each Coldplay Album" center />
            <section className="container">
                {content.map((album, index) => (
                    // <MusicDisplay key={album.id} data={album} type="album" />
                    <div key={index}></div>
                ))}
                <br />
            </section>
        </main>
    );
}

export let metadata: Metadata = {
    title: 'Coldplay Albums',
};
