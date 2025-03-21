import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';

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
    index: number;
    components: MusicBlock;
}

export default function MusicDisplay({ index, components }: MusicBlockProps) {
    // Build Links
    let apple: string;
    if (components.type === 'Artist') {
        apple = `https://music.apple.com/us/artist/${components.link.appleURI}`;
    } else {
        apple = `https://music.apple.com/us/album/${components.link.appleURI}`;
    }
    let spotify: string;
    if (components.type === 'Artist') {
        spotify = `https://open.spotify.com/artist/${components.link.spotifyURI}`;
    } else {
        spotify = `https://open.spotify.com/album/${components.link.spotifyURI}`;
    }

    // Build Out Tags
    const tags = (
        <div className="text-sm text-center flex flex-col gap-1">
            {components.tags.map((tag, index) => (
                <span key={index}>
                    <h3 className=" font-extralight">{tag.title}</h3>
                    <p className=" text-base font-normal">{tag.content}</p>
                </span>
            ))}
        </div>
    );

    // Build Switch
    const largeDirection = index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse';

    return (
        <div className="flex items-center justify-center flex-col gap-4 p-4 lg:p-6 w-10/12 mx-auto border rounded-md mb-3">
            <h1 className="w-full mx-auto text-center text-2xl font-medium">{components.name}</h1>
            <Separator />
            <div className={`w-full mx-auto flex items-center justify-center gap-2 flex-col ${largeDirection}`}>
                <div className="w-full lg:w-4/12 mx-auto flex items-center justify-center gap-2 lg:gap-3 flex-col">
                    <img
                        className=" rounded-md border w-full max-w-64 mx-auto lg:mt-3"
                        src={components.image.src}
                        alt={components.image.alt}
                    />
                    {/* <Image className=" rounded-md border w-full max-w-64 mx-auto lg:mt-3" src={ components.image.src } alt={ components.image.alt } /> */}
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Link href={apple}>
                            <Image className=" w-5" src={AppleMusicLogo} alt="Logo, Apple Music" />
                        </Link>
                        <Link href={spotify}>
                            <Image className=" w-5" src={SpotifyLogo} alt="Logo, Spotify" />
                        </Link>
                    </div>
                    {components.type === 'Album' && <>{tags}</>}
                </div>
                <Separator className="lg:hidden my-2 w-9/12" />
                <div className="font-light w-10/12 lg:w-7/12 mx-auto flex items-center justify-center gap-2 flex-col lg:flex-col-reverse">
                    <div className="">{components.type === 'Artist' && <>{tags}</>}</div>

                    <div className="max-h-[300px] overflow-y-auto md:max-h-[none] md:overflow-y-visible lg:max-h-[500px] lg:overflow-y-scroll">
                        {components.content.map((paragraph, index) => (
                            <span key={index}>
                                <span className="inline-block mr-8"></span>
                                {paragraph}
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
