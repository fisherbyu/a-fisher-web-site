import { Asset } from './asset.types';
import { Genre } from './genre.types';
import { Link } from './link.types';

export type MusicItem = {
    link: Link;
    image: Asset;
    genres: Genre[];
};
