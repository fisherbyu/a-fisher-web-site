/**
 * Musical Artist Record
 * @property {string} id - Artist ID
 * @property {number} tier - Classification tier of the artist
 * @property {number} [rank] - Optional ranking of the artist within the tier
 * @property {string} name - Name of the artist
 * @property {Content[]} content - Array of content items
 * @property {Tag[]} tags - Array of categorization tags
 * @property {MusicLink} link - Link to Artist Musical Profile
 * @property {Image} image - Artist Image Info
 */
export interface Artist {
    id: string;
    tier: number;
    rank?: number;
    name: string;
    content: Content[];
    tags: Tag[];
    link: MusicLink;
    image: Image;
}

/**
 * Album Record
 * @property {string} id - Album ID
 * @property {number} rank - Ranking of the album
 * @property {string} name - Name of the album
 * @property {Content[]} content - Array of content items
 * @property {Tag[]} tags - Array of categorization tags
 * @property {MusicLink} link - Link to Album Musical Profile
 * @property {Image} image - Album Cover Art Info
 */
export interface Album {
    id: string;
    rank: number;
    name: string;
    content: Content[];
    tags: Tag[];
    link: MusicLink;
    image: Image;
}

/**
 * Content Record
 * @property {string} id - Content ID
 * @property {number} order - Display order of the content
 * @property {string} text - Content text
 */
export interface Content {
    id: string;
    order: number;
    text: string;
}

/**
 * Tag Record
 * @property {string} id - Tag ID
 * @property {string} title - Tag title
 * @property {string} content - Tag content description
 */
export interface Tag {
    id: string;
    title: string;
    content: string;
}

/**
 * Music Link Record
 * @property {string} id - Link ID
 * @property {string} appleURI - Apple Music URI
 * @property {string} spotifyURI - Spotify URI
 */
export interface MusicLink {
    id: string;
    appleURI: string;
    spotifyURI: string;
}

/**
 * Image Record
 * @property {string} id - Image ID
 * @property {string} src - Image source URL
 * @property {string} alt - Alternative text for the image
 */
export interface Image {
    id: string;
    src: string;
    alt: string;
}
