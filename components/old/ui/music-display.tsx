import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';
import { Album, Artist } from '@/types';
import { getPublicUrl } from '@/lib';
import { Divider } from 'thread-ui';

interface MusicBlock {
    name: string;
    content: string[];
    type: string;
    tags: {
        title: string;
        content: string;
    }[];
    link: {
        appleURI: string;
        spotifyURI: string;
    };
    image: {
        src: string;
        alt: string;
    };
}

interface MusicBlockProps {
    type: 'artist' | 'album';
    data: Artist | Album;
}

export default function MusicDisplay({ data, type }: MusicBlockProps) {
    // Build Links
    let apple: string;
    if (type === 'artist') {
        apple = `https://music.apple.com/us/artist/${data.link!.appleURI}`;
    } else {
        apple = `https://music.apple.com/us/album/${data.link!.appleURI}`;
    }
    let spotify: string;
    if (type === 'album') {
        spotify = `https://open.spotify.com/artist/${data.link!.spotifyURI}`;
    } else {
        spotify = `https://open.spotify.com/album/${data.link!.spotifyURI}`;
    }

    // Build Out Tags
    const attributes = (
        <div className="text-sm text-center flex flex-col gap-1">
            {data.attributes.map((attribute, index) => (
                <span key={index}>
                    <h3 className=" font-extralight">{attribute.title}</h3>
                    <p className=" text-base font-normal">{attribute.text}</p>
                </span>
            ))}
        </div>
    );

    // Build Switch
    const largeDirection = data.id % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse';

    return (
        <div className="flex items-center justify-center flex-col gap-4 p-4 lg:p-6 w-10/12 max-w-2xl mx-auto border rounded-md mb-3">
            <h1 className="w-full mx-auto text-center text-2xl font-medium">{data.name}</h1>
            <Divider />
            <div className={`w-full mx-auto flex items-center justify-center gap-2 flex-col ${largeDirection}`}>
                <div className="w-full lg:w-4/12 mx-auto flex items-center justify-center gap-2 lg:gap-3 flex-col">
                    {data.image && (
                        <Image
                            src={getPublicUrl(data.image.src)}
                            alt={data.image.alt}
                            height={data.image.height}
                            width={data.image.width}
                            className="rounded-md border w-full max-w-64 mx-auto lg:mt-3"
                        />
                    )}
                    {/* <Image className=" rounded-md border w-full max-w-64 mx-auto lg:mt-3" src={ components.image.src } alt={ components.image.alt } /> */}
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Link href={apple}>
                            <Image className=" w-5" src={AppleMusicLogo} alt="Logo, Apple Music" />
                        </Link>
                        <Link href={spotify}>
                            <Image className=" w-5" src={SpotifyLogo} alt="Logo, Spotify" />
                        </Link>
                    </div>
                    {type === 'album' && <>{attributes}</>}
                </div>
                <div className="lg:hidden my-2 w-9/12">
                    <Divider />
                </div>
                <div className="font-light w-10/12 lg:w-7/12 mx-auto flex items-center justify-center gap-2 flex-col lg:flex-col-reverse">
                    <div className="">{type === 'artist' && <>{attributes}</>}</div>

                    <div className="max-h-[300px] overflow-y-auto md:max-h-[none] md:overflow-y-visible lg:max-h-[500px] lg:overflow-y-scroll">
                        {data.contents.map((content, index) => (
                            <span key={index}>
                                <span className="inline-block mr-8"></span>
                                {content.text}
                                <br />
                                <br />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export let metadata: Metadata = {
    title: 'Coldplay Albums',
};
