'use client';
import { Container, MediaCard, SkeletonLayoutLoader } from 'thread-ui';
import { getMusicLink, getPublicUrl, useAlbums } from '@/lib';
import Image from 'next/image';
import Link from 'next/link';
import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';
import { LoadingError } from '@/components';

export default function AlbumContents() {
    const { albums, isLoading, error } = useAlbums();

    if (error) {
        return <LoadingError />;
    }

    if (isLoading) {
        return (
            <div className="max-w-96 mx-auto">
                <SkeletonLayoutLoader mdcol={1} itemConfig={{ h: '200px', w: '100%' }} />;
            </div>
        );
    }

    return (
        <Container>
            <div className="flex flex-col gap-8">
                {albums?.map((album, _) => {
                    const releaseYear = album.releaseDate?.getFullYear();

                    const details = [
                        {
                            title: `Favorite Track${album.favoriteTracks.length > 1 ? 's' : ''}:`,
                            details: album.favoriteTracks.join(', '),
                        },
                        ...(releaseYear ? [{ title: 'Year:', details: String(releaseYear) }] : []),
                    ];

                    return (
                        <MediaCard
                            key={_}
                            title={album.title}
                            description={album.contents.map((content) => content)}
                            details={details}
                            detailsPosition="image"
                            image={
                                <Image
                                    src={getPublicUrl(album.image.src)}
                                    alt={album.image.alt}
                                    height={album.image.height}
                                    width={album.image.width}
                                />
                            }
                            imagePosition={_ % 2 === 0 ? 'right' : 'left'}
                            size="lg"
                            links={[
                                <Link href={getMusicLink(album.link.appleURI, 'album', 'apple')}>
                                    <Image
                                        className=" w-5"
                                        src={AppleMusicLogo}
                                        alt="Logo, Apple Music"
                                    />
                                </Link>,
                                <Link
                                    href={getMusicLink(album.link.spotifyURI, 'album', 'spotify')}
                                >
                                    <Image className=" w-5" src={SpotifyLogo} alt="Logo, Spotify" />
                                </Link>,
                            ]}
                        />
                    );
                })}
            </div>
        </Container>
    );
}
