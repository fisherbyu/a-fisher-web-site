import { Content, Tag, MusicLink, Image } from '@/types';

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
