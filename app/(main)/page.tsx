// Import Images
import Image from 'next/image';
import ImageAF_3_2 from '@/public/home/andrew-fisher-3-2.jpg';
import ImageAF_5_4 from '@/public/home/andrew-fisher-5-4.jpg';
import Folsom from '@/public/home/folsom.jpg';
import LaLaLand from '@/public/home/movies/la-la-land.webp';
import WalterMitty from '@/public/home/movies/the-secret-life-of-walter-mitty.webp';
import SpiderMan from '@/public/home/movies/spiderman-into-the-spider-verse.webp';
import WonderfulLife from '@/public/home/movies/its-a-wonderful-life.webp';
import ProjectHailMary from '@/public/home/movies/project-hail-mary.webp';
import Utah from '@/public/home/alpine-loop.jpg';
import HBLL from '@/public/home/hbll.jpg';
import Philippines from '@/public/home/philippines.jpg';
// Import Components
import { Divider, ColumnLayout, ImagePanel, Title, Carousel, MediaOverlay } from 'thread-ui';
import { MovieReviewContent } from '@/components';

// Content
export default function Home() {
    return (
        <>
            <br />
            {/* Intro Image */}
            <ImagePanel
                title="I'm Andrew!"
                contents={[
                    'I love music, history, and cooking for my friends.  I use technology to solve problems for people.  I recently graduated from BYU as a Master of Information Systems Managment.',
                ]}
                image={
                    <Image
                        placeholder="blur"
                        loading="eager"
                        src={ImageAF_3_2}
                        alt="Picture of Andrew Fisher"
                    />
                }
                smImage={
                    <Image
                        placeholder="blur"
                        loading="eager"
                        src={ImageAF_5_4}
                        alt="Picture of Andrew Fisher"
                    />
                }
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
                        content: (
                            <Image
                                placeholder="blur"
                                src={Folsom}
                                alt={'Rainbow Bridge, Folsom CA'}
                            />
                        ),
                    },
                    {
                        title: 'Philippines',
                        description:
                            'I served a mission for The Church of Jesus Christ of Latter-day Saints in Isabela Philippines.    The people of the Philippines are the most friendly, kind and amazing people on Earth.',
                        content: (
                            <Image
                                placeholder="blur"
                                src={Philippines}
                                alt={'Corn Field, Echague Philippines'}
                            />
                        ),
                    },
                    {
                        title: 'BYU',
                        description:
                            'I recently graduated from BYU.    I loved learning in such a spiritual environment and I made lifelong friends during my time here.',
                        content: <Image placeholder="blur" src={HBLL} alt="HBLL Library at BYU" />,
                    },
                    {
                        title: 'Utah',
                        description:
                            "I'm lucky to live in Utah, it's such a pretty place with so much to do.",
                        content: (
                            <Image
                                placeholder="blur"
                                src={Utah}
                                alt="Autumn leaves in Alpine Loop, Provo Canyon"
                            />
                        ),
                    },
                ]}
            />
            {/* Favorite Movies */}
            <Carousel
                title="My Favorite Movies"
                description="These are my absolute favorite movies and I return to them time and time again"
                mdCols={3}
                controlsPosition="below"
                itemWrapper="cardFrame"
                items={[
                    {
                        content: (
                            <MediaOverlay
                                overlay={<MovieReviewContent title="La La Land" stars={5} />}
                            >
                                <Image
                                    placeholder="blur"
                                    src={LaLaLand}
                                    alt="La La Land Movie Poster"
                                />
                            </MediaOverlay>
                        ),
                    },
                    {
                        content: (
                            <MediaOverlay
                                overlay={
                                    <MovieReviewContent
                                        title="The Secret Life of Walter Mitty"
                                        stars={5}
                                    />
                                }
                            >
                                <Image
                                    placeholder="blur"
                                    src={WalterMitty}
                                    alt="The Secret Life of Walter Mitty Movie Poster"
                                />
                            </MediaOverlay>
                        ),
                    },
                    {
                        content: (
                            <MediaOverlay
                                overlay={
                                    <MovieReviewContent
                                        title="Spider-Man: Into the Spider-Verse"
                                        stars={4.5}
                                    />
                                }
                            >
                                <Image
                                    placeholder="blur"
                                    src={SpiderMan}
                                    alt="Spider Man: Into the Spiderverse Movie Poster"
                                />
                            </MediaOverlay>
                        ),
                    },
                    {
                        content: (
                            <MediaOverlay
                                overlay={
                                    <MovieReviewContent title="Project Hail Mary" stars={4.5} />
                                }
                            >
                                <Image
                                    placeholder="blur"
                                    src={ProjectHailMary}
                                    alt="Project Hail Mary Movie Poster"
                                />
                            </MediaOverlay>
                        ),
                    },
                    {
                        content: (
                            <MediaOverlay
                                overlay={
                                    <MovieReviewContent title="It's a Wonderful Life" stars={4.5} />
                                }
                            >
                                <Image
                                    placeholder="blur"
                                    src={WonderfulLife}
                                    alt="It's a Wonderful Life Movie Poster"
                                />
                            </MediaOverlay>
                        ),
                    },
                ]}
            />
        </>
    );
}
