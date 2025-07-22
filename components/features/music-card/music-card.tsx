import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';
import { MusicCardProps, MusicItemType } from './music-card.types';
import { Divider } from 'thread-ui';
import Image from 'next/image';
import { getPublicUrl } from '@/lib';
import Link from 'next/link';
export const MusicCard = ({ index, item, type }: MusicCardProps) => {
    // Generate Links
    const musicLinks =
        type === 'artist'
            ? {
                  apple: `https://music.apple.com/us/artist/${item.link?.appleURI}`,
                  spotify: `https://open.spotify.com/artist/${item.link?.spotifyURI}`,
              }
            : {
                  apple: `https://music.apple.com/us/album/${item.link?.appleURI}`,
                  spotify: `https://open.spotify.com/album/${item.link?.spotifyURI}`,
              };

    // Switch Direction every other card
    const largeDirection = index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse';

    // Build Out Tags
    const attributes = (
        <div className="text-sm text-center flex flex-col gap-1">
            {item.attributes.map((attribute, index) => (
                <span key={index}>
                    <h3 className=" font-extralight">{attribute.title}</h3>
                    <p className=" text-base font-normal">{attribute.text}</p>
                </span>
            ))}
        </div>
    );

    return (
        <div className="flex items-center justify-center flex-col gap-4 p-4 lg:p-6 w-10/12 max-w-2xl mx-auto border rounded-md mb-3">
            <h1 className="w-full mx-auto text-center text-2xl font-medium">{item.name}</h1>
            <Divider />
            <div className={`w-full mx-auto flex items-center justify-center gap-2 flex-col ${largeDirection}`}>
                <div className="w-full lg:w-4/12 mx-auto flex items-center justify-center gap-2 lg:gap-3 flex-col">
                    {item.image && (
                        <Image
                            src={getPublicUrl(item.image.src)}
                            alt={item.image.alt}
                            height={item.image.height}
                            width={item.image.width}
                            className="rounded-md border w-full max-w-64 mx-auto lg:mt-3"
                        />
                    )}
                    {/* <Image className=" rounded-md border w-full max-w-64 mx-auto lg:mt-3" src={ components.image.src } alt={ components.image.alt } /> */}
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Link href={musicLinks.apple}>
                            <Image className=" w-5" src={AppleMusicLogo} alt="Logo, Apple Music" />
                        </Link>
                        <Link href={musicLinks.spotify}>
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
                        {item.contents.map((content, index) => (
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
};
