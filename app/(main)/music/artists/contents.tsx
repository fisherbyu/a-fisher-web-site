'use client';
import { MediaCard } from 'thread-ui';
import { getMusicLink, getPublicUrl, useArtists } from '@/lib';
import Image from 'next/image';
import Link from 'next/link';
import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';

export default function ArtistContents() {
    const { artists, isLoading, error } = useArtists();

    return (
        <div className="flex flex-col gap-4">
            {artists?.map((artist, _) => (
                <MediaCard
                    key={_}
                    title={artist.name}
                    description={artist.contents.map((content) => content.text)}
                    details={artist.attributes.map((attribute) => ({
                        title: attribute.title,
                        details: attribute.text,
                    }))}
                    detailsPosition="text"
                    image={
                        <Image
                            src={getPublicUrl(artist.image.src)}
                            alt={artist.image.alt}
                            height={artist.image.height}
                            width={artist.image.width}
                        />
                    }
                    imagePosition={_ % 2 === 0 ? 'right' : 'left'}
                    size="md"
                    links={[
                        <Link href={getMusicLink(artist.link.appleURI, 'artist', 'apple')}>
                            <Image className=" w-5" src={AppleMusicLogo} alt="Logo, Apple Music" />
                        </Link>,
                        <Link href={getMusicLink(artist.link.spotifyURI, 'artist', 'spotify')}>
                            <Image className=" w-5" src={SpotifyLogo} alt="Logo, Spotify" />
                        </Link>,
                    ]}
                />
            ))}
        </div>
    );
}
