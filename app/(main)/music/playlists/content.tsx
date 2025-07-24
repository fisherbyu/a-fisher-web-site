'use client';
import Image from 'next/image';
import { useState } from 'react';
import AppleMusicLogo from '@/public/music/apple-music.svg';
import SpotifyLogo from '@/public/music/spotify.svg';
import { ColumnItem, ColumnLayout } from 'thread-ui';
import { usePlaylists } from '@/lib';

export const PlaylistContents = () => {
    const { playlists, isLoading, error } = usePlaylists();
    // iFrame Constuction Logic
    const getAppleFrame = (uri?: string) => {
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

    const getSpotifyFrame = (uri?: string) => {
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

    // Determine which to Display
    const [displayType, setDisplayType] = useState<'Apple' | 'Spotify'>('Apple');

    function switchToApple() {
        setDisplayType('Apple');
    }

    function switchToSpotify() {
        setDisplayType('Spotify');
    }

    const applePlaylists: ColumnItem[] =
        playlists?.map((playlist) => ({
            content: (
                <div key={playlist.title} className="w-full md:w-11/12 lg:w-full mx-auto">
                    {getAppleFrame(playlist.link?.appleURI)}
                </div>
            ),
        })) || [];

    const spotifyPlaylists: ColumnItem[] =
        playlists?.map((playlist) => ({
            content: (
                <div key={playlist.title} className="w-full md:w-11/12 lg:w-full mx-auto">
                    {getSpotifyFrame(playlist.link?.spotifyURI)}
                </div>
            ),
        })) || [];

    return (
        <div className="container">
            <div className="mx-auto flex flex-row items-center justify-center gap-2 pb-4">
                <button className="" onClick={switchToApple}>
                    <Image className=" w-9" src={AppleMusicLogo} alt="Logo, Apple Music" />
                </button>
                <button className="" onClick={switchToSpotify}>
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
