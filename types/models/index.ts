// artist.ts
export type Artist = {
    id: number;
    name: string;
    tier: number;
    rank?: number;
    contents: Content[];
    attributes: Attribute[];
    link?: Link;
    image?: Image;
};

// album.ts
export type Album = {
    id: number;
    name: string;
    rank: number;
    contents: Content[];
    attributes: Attribute[];
    link?: Link;
    image?: Image;
};

// playlist.ts
export type Playlist = {
    id: number;
    title: string;
    link?: Link;
};

// link.ts
export type Link = {
    id: number;
    appleURI: string;
    spotifyURI: string;
};

// image.ts
export type Image = {
    id: number;
    src: string;
    alt: string;
    height: number;
    width: number;
};

// content.ts
export type Content = {
    id: number;
    order: number;
    text: string;
};

// attribute.ts
export type Attribute = {
    id: number;
    order: number;
    title: string;
    text: string;
};
