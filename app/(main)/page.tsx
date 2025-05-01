'use client';
// Import Images
import Image, { StaticImageData } from 'next/image';
import ImageAF_3_2 from '@/public/home/andrew-fisher-3-2.jpg';
import ImageAF_5_4 from '@/public/home/andrew-fisher-5-4.jpg';
import Folsom from '@/public/home/folsom.jpg';
import LaLaLand from '@/public/home/movies/lalaland.jpg';
import WalterMitty from '@/public/home/movies/waltermitty.jpg';
import SpiderMan from '@/public/home/movies/spiderman.jpg';
import Utah from '@/public/home/alpine-loop.jpg';
import HBLL from '@/public/home/hbll.jpg';
import Philippines from '@/public/home/philippines.jpg';
// Import Components
import GridBlock from '@/components/old/ui/grid-block';
import { Divider, ColumnLayout, ImagePanel, Text, Title, H1 } from 'thread-ui';

// Declare Content
const places: {
    title?: string;
    caption?: string;
    mdcol: number;
    lgcol: number;
    items: { title?: string; content?: string; image: { src: StaticImageData; alt: string } }[];
} = {
    mdcol: 2,
    lgcol: 4,
    items: [
        {
            title: 'Folsom',
            content:
                'I grew up in Folsom, California.    It was a great place to grow up with tons of friendly people and opportunities for me as a youth',
            image: {
                src: Folsom,
                alt: 'Rainbow Bridge, Folsom CA',
            },
        },
        {
            title: 'Philippines',
            content:
                'I served a mission for The Church of Jesus Christ of Latter-day Saints in Isabela Philippines.    The people of the Philippines are the most friendly, kind and amazing people on Earth.',
            image: {
                src: Philippines,
                alt: 'Corn Field, Echague Philippines',
            },
        },
        {
            title: 'BYU',
            content:
                "I'm currently studying at BYU.    I love learning in such a spiritual environment and I've made lifelong friends during my time here.",
            image: {
                src: HBLL,
                alt: 'HBLL Library at BYU',
            },
        },
        {
            title: 'Utah',
            content: "I'm lucky to live in Utah, its such a pretty place with so much to do.",
            image: {
                src: Utah,
                alt: 'Autumn leaves in Alpine Loop, Provo Canyon',
            },
        },
    ],
};

const movies: {
    title?: string;
    caption?: string;
    mdcol: number;
    lgcol: number;
    items: { title?: string; content?: string; image: { src: StaticImageData; alt: string } }[];
} = {
    title: 'My Favorite Movies',
    caption: "These movies definitely aren't similar but I love each of them and rewatch them often",
    mdcol: 1,
    lgcol: 3,
    items: [
        {
            image: {
                src: LaLaLand,
                alt: 'La La Land Movie Poster',
            },
        },
        {
            image: {
                src: WalterMitty,
                alt: 'The Secret Life of Walter Mitty Movie Poster',
            },
        },
        {
            image: {
                src: SpiderMan,
                alt: 'Spider Man: Into the Spiderverse Movie Poster',
            },
        },
    ],
};

// Content
export default function Home() {
    return (
        <main>
            <br />
            <ImagePanel
                title="I'm Andrew!"
                contents={[
                    "I'm a Master of Information Systems Managment Student at BYU interested in software development. I love serving and getting to know people and using technology to create powerful solutions. I love music and music history and am an avid cook and baker. Thanks for visiting my site!",
                ]}
                image={<Image src={ImageAF_3_2} alt="Picture of Andrew Fisher" />}
                smImage={<Image src={ImageAF_5_4} alt="Picture of Andrew Fisher" />}
            />
            <Divider width="75%" marginY="36px" />
            <Title align="center" inline>
                About Me
            </Title>
            <GridBlock components={places} />
            <GridBlock components={movies} />
        </main>
    );
}
