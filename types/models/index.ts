// artist.ts
export type Artist = {
    id: string;
    name: string;
    tier: number;
    rank?: number;
    link: Link;
    image: Image;
    contents: ContentBlock[];
    attributes: Attribute[];
};

// album.ts
export type Album = {
    id: string;
    name: string;
    rank: number;
    link: Link;
    image: Image;
    contents: ContentBlock[];
    attributes: Attribute[];
};

// playlist.ts
export type Playlist = {
    id: string;
    title: string;
    link: Link;
};

// link.ts
export type Link = {
    id: string;
    appleURI: string;
    spotifyURI: string;
};

// image.ts
export type Image = {
    id: string;
    src: string;
    alt: string;
};

// content.ts
export type ContentBlock = {
    id: string;
    content: string;
    order: number;
};

// attribute.ts
export type Attribute = {
    id: string;
    title: string;
    content: string;
    order: number;
};
