import { Genre } from '../genre';
import { Image } from '../image';
import { Link } from '../link';

export type MusicItem = {
    link: Link;
    image: Image;
    genres: Genre[];
};
