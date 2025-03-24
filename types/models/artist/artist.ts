import { Content, Tag, MusicLink, Image } from '@/types';

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
