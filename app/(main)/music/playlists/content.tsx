'use client';
import Image from 'next/image';
import { useState } from 'react';
import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';
import { ColumnItem, ColumnLayout, SkeletonLayout } from 'thread-ui';
import { usePlaylists } from '@/lib';
import { LoadingError } from '@/components';

const AppleMusicFrame = ({ uri }: { uri?: string }) => {
    const link = `https://embed.music.apple.com/us/playlist/${uri}`;

    return (
        <iframe
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            width="100%"
            height="450"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation fullscreen picture-in-picture"
            src={link}
        ></iframe>
    );
};

const SpotifyFrame = ({ uri }: { uri?: string }) => {
    const link = `https://open.spotify.com/embed/playlist/${uri}?utm_source=generator`;

    return (
        <iframe
            src={link}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
        ></iframe>
    );
};

export const PlaylistContents = () => {
    // Fetch Playlists
    const { playlists, isLoading, error } = usePlaylists();

    // Determine which to Display
    const [displayType, setDisplayType] = useState<'Apple' | 'Spotify'>('Apple');

    const switchToApple = () => {
        setDisplayType('Apple');
    };

    const switchToSpotify = () => {
        setDisplayType('Spotify');
    };

    const applePlaylists: ColumnItem[] =
        playlists?.map((playlist) => ({
            content: (
                <div key={playlist.title} className="w-full md:w-11/12 lg:w-full mx-auto">
                    <AppleMusicFrame uri={playlist.link?.appleURI} />
                </div>
            ),
        })) || [];

    const spotifyPlaylists: ColumnItem[] =
        playlists?.map((playlist) => ({
            content: (
                <div key={playlist.title} className="w-full md:w-11/12 lg:w-full mx-auto">
                    <SpotifyFrame uri={playlist.link?.spotifyURI} />
                </div>
            ),
        })) || [];

    if (error) {
        return <LoadingError />;
    }

    if (isLoading) {
        return (
            <div className="w-10/12 pt-8 mx-auto">
                <SkeletonLayout mdcol={1} lgcol={2} itemConfig={{ h: '200px', w: '100%' }} />;
            </div>
        );
    }

    return (
        <div className="container">
            <div className="mx-auto flex flex-row items-center justify-center gap-2 pb-4">
                <button className="cursor-pointer" onClick={switchToApple}>
                    <Image className=" w-9" src={AppleMusicLogo} alt="Logo, Apple Music" />
                </button>
                <button className="cursor-pointer" onClick={switchToSpotify}>
                    <Image className=" w-9" src={SpotifyLogo} alt="Logo, Spotify" />
                </button>
            </div>
            <div id="applemusic" className={displayType === 'Apple' ? '' : 'hidden'}>
                <ColumnLayout mdcol={1} lgcol={2} items={applePlaylists} />
            </div>
            <div id="spotify" className={displayType === 'Spotify' ? '' : 'hidden'}>
                <ColumnLayout mdcol={1} lgcol={2} items={spotifyPlaylists} />
            </div>
        </div>
    );
};
