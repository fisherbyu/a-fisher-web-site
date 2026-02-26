'use client';
import { MediaCard, SkeletonLayout } from 'thread-ui';
import { getMusicLink, getPublicUrl, useAlbums } from '@/lib';
import Image from 'next/image';
import Link from 'next/link';
import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';

export default function AlbumContents() {
    const { albums, isLoading, error } = useAlbums();

    if (isLoading) {
        return (
            <div className="max-w-96 mx-auto">
                <SkeletonLayout mdcol={1} itemConfig={{ h: '200px', w: '100%' }} />;
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {albums?.map((album, _) => (
                <MediaCard
                    key={_}
                    title={album.name}
                    description={album.contents.map((content) => content.text)}
                    details={album.attributes.map((attribute) => ({
                        title: attribute.title,
                        details: attribute.text,
                    }))}
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
                            <Image className=" w-5" src={AppleMusicLogo} alt="Logo, Apple Music" />
                        </Link>,
                        <Link href={getMusicLink(album.link.spotifyURI, 'album', 'spotify')}>
                            <Image className=" w-5" src={SpotifyLogo} alt="Logo, Spotify" />
                        </Link>,
                    ]}
                />
            ))}
        </div>
    );
}
