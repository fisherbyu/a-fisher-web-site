import { Genre } from './genre.types';
import { Image } from './image.types';
import { Link } from './link.types';

export type MusicItem = {
    link: Link;
    image: Image;
    genres: Genre[];
};
