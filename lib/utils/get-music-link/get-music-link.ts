type LinkType = 'album' | 'artist' | 'playlist';
type MusicPlatform = 'apple' | 'spotify';

const MusicPlatformURLs: Record<MusicPlatform, Record<LinkType, (uri: string) => string>> = {
    apple: {
        album: (uri) => `https://music.apple.com/us/album/${uri}`,
        artist: (uri) => `https://music.apple.com/us/artist/${uri}`,
        playlist: (uri) => `https://embed.music.apple.com/us/playlist/${uri}`,
    },
    spotify: {
        album: (uri) => `https://open.spotify.com/album/${uri}`,
        artist: (uri) => `https://open.spotify.com/artist/${uri}`,
        playlist: (uri) => `https://open.spotify.com/embed/playlist/${uri}?utm_source=generator`,
    },
};

export const getMusicLink = (uri: string, type: LinkType, platform: MusicPlatform): string => {
    return MusicPlatformURLs[platform][type](uri);
};
