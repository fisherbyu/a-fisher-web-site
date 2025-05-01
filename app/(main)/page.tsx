'use client';
// Import Images
import Image from 'next/image';
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
import { Divider, ColumnLayout, ImagePanel, Title } from 'thread-ui';

// Content
export default function Home() {
    return (
        <main>
            <br />
            {/* Intro Image */}
            <ImagePanel
                title="I'm Andrew!"
                contents={[
                    "I'm a Master of Information Systems Managment Student at BYU interested in software development. I love serving and getting to know people and using technology to create powerful solutions. I love music and music history and am an avid cook and baker. Thanks for visiting my site!",
                ]}
                image={<Image src={ImageAF_3_2} alt="Picture of Andrew Fisher" />}
                smImage={<Image src={ImageAF_5_4} alt="Picture of Andrew Fisher" />}
            />
            <Divider width="75%" marginY="36px" />
            {/* About Me Section */}
            <Title align="center" inline>
                About Me
            </Title>
            {/* Places I grew Up */}
            <ColumnLayout
                mdcol={2}
                lgcol={4}
                items={[
                    {
                        title: 'Folsom',
                        description:
                            'I grew up in Folsom, California.    It was a great place to grow up with tons of friendly people and opportunities for me as a youth',
                        content: <Image src={Folsom} alt={'Rainbow Bridge, Folsom CA'} />,
                    },
                    {
                        title: 'Philippines',
                        description:
                            'I served a mission for The Church of Jesus Christ of Latter-day Saints in Isabela Philippines.    The people of the Philippines are the most friendly, kind and amazing people on Earth.',
                        content: <Image src={Philippines} alt={'Corn Field, Echague Philippines'} />,
                    },
                    {
                        title: 'BYU',
                        description:
                            "I'm currently studying at BYU.    I love learning in such a spiritual environment and I've made lifelong friends during my time here.",
                        content: <Image src={HBLL} alt="HBLL Library at BYU" />,
                    },
                    {
                        title: 'Utah',
                        description: "I'm lucky to live in Utah, its such a pretty place with so much to do.",
                        content: <Image src={Utah} alt="Autumn leaves in Alpine Loop, Provo Canyon" />,
                    },
                ]}
            />
            {/* Favorite Movies */}
            <ColumnLayout
                title="My Favorite Movies"
                caption="These are my absolute favorite movies and I return to them time and time again"
                mdcol={1}
                lgcol={3}
                items={[
                    {
                        content: <Image src={LaLaLand} alt="La La Land Movie Poster" />,
                    },
                    {
                        content: <Image src={WalterMitty} alt="The Secret Life of Walter Mitty Movie Poster" />,
                    },
                    {
                        content: <Image src={SpiderMan} alt="Spider Man: Into the Spiderverse Movie Poster" />,
                    },
                ]}
            />
        </main>
    );
}
