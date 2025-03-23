import type { Metadata } from 'next';
import Blake from '@/public/photography/blake.jpg';
import Ptarmiganlake from '@/public/photography/ptarmigan-lake.jpg';
import Provocanyon4 from '@/public/photography/provo-canyon-4.jpg';
import Hope3 from '@/public/photography/hope-3.jpg';
import Alpineloop1 from '@/public/photography/alpine-loop-1.jpg';
import Beachwaves from '@/public/photography/beach-waves.jpg';
import Hope2 from '@/public/photography/hope-2.jpg';
import Provocanyon1 from '@/public/photography/provo-canyon-1.jpg';
import Provocanyon3 from '@/public/photography/provo-canyon-3.jpg';
import Alpineloop2 from '@/public/photography/alpine-loop-2.jpg';
import Alaskariver2 from '@/public/photography/alaska-river-2.jpg';
import Milkyway from '@/public/photography/milky-way.jpg';
import Hope1 from '@/public/photography/hope-1.jpg';
import Provocanyon2 from '@/public/photography/provo-canyon-2.jpg';
import Byuautumn from '@/public/photography/byu-autumn.jpg';
import Archesnp from '@/public/photography/arches-np.jpg';
import Alaskatrail from '@/public/photography/alaska-trail.jpg';
import Andrewfisherpoint from '@/public/photography/andrew-fisher-point.jpg';
import Alaskariver from '@/public/photography/alaska-river.jpg';
import Oceanboat from '@/public/photography/ocean-boat.jpg';
import Virginriver from '@/public/photography/virgin-river.jpg';
import Emily from '@/public/photography/emily.jpg';
import Snowcanyon from '@/public/photography/snow-canyon.jpg';
import Zion2 from '@/public/photography/zion-2.jpg';
import Sydney from '@/public/photography/sydney.jpg';
import Zion1 from '@/public/photography/zion-1.jpg';
import Rexburg from '@/public/photography/rexburg.jpg';
import Wrightslake from '@/public/photography/wrights-lake.jpg';
import Wrightslake2 from '@/public/photography/wrights-lake-2.jpg';
import Sacramentostreet from '@/public/photography/sacramento-street.jpg';
import { StaticImageData } from 'next/image';
import MasonryBlock from '@/components/old/ui/masonry-block';
import PageTitle from '@/components/old/ui/page-title';
const title: { title: string; subtitle?: string } = {
    title: 'My Photography',
    subtitle:
        "Here are some of my photos I've taken over the years. I got interested in photography because my sister is an amazing photographer and I love capturing moments.",
};
const photos: { src: StaticImageData; alt: string }[] = [
    { src: Andrewfisherpoint, alt: 'Andrewfisherpoint' },
    { src: Hope3, alt: 'Hope3' },
    { src: Hope1, alt: 'Hope1' },
    { src: Rexburg, alt: 'Rexburg' },
    { src: Virginriver, alt: 'Virginriver' },
    { src: Oceanboat, alt: 'Oceanboat' },
    { src: Provocanyon4, alt: 'Provocanyon4' },
    { src: Sacramentostreet, alt: 'Sacramentostreet' },
    { src: Zion2, alt: 'Zion2' },
    { src: Alpineloop1, alt: 'Alpineloop1' },
    { src: Beachwaves, alt: 'Beachwaves' },
    { src: Blake, alt: 'Blake' },
    { src: Alpineloop2, alt: 'Alpineloop2' },
    { src: Snowcanyon, alt: 'Snowcanyon' },
    { src: Zion1, alt: 'Zion1' },
    { src: Alaskariver, alt: 'Alaskariver' },
    { src: Byuautumn, alt: 'Byuautumn' },
    { src: Provocanyon2, alt: 'Provocanyon2' },
    { src: Milkyway, alt: 'Milkyway' },
    { src: Ptarmiganlake, alt: 'Ptarmiganlake' },
    { src: Archesnp, alt: 'Archesnp' },
    { src: Provocanyon3, alt: 'Provocanyon3' },
    { src: Wrightslake, alt: 'Wrightslake' },
    { src: Sydney, alt: 'Sydney' },
    { src: Hope2, alt: 'Hope2' },
    { src: Alaskatrail, alt: 'Alaskatrail' },
    { src: Emily, alt: 'Emily' },
    { src: Provocanyon1, alt: 'Provocanyon1' },
    { src: Wrightslake2, alt: 'Wrightslake2' },
    { src: Alaskariver2, alt: 'Alaskariver2' },
];

const components: { title?: string; caption?: string; items: { src: StaticImageData; alt: string }[] } = {
    items: photos,
};
export default function PhotographyPage() {
    return (
        <main>
            <PageTitle components={title} />
            <MasonryBlock components={components} />
        </main>
    );
}

export let metadata: Metadata = {
    title: 'My Photography',
};
