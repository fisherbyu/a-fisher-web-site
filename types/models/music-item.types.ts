import { Asset } from './asset.types';
import { Genre } from './genre.types';
import { Link } from './link.types';

export type MusicItem = {
    link: Link;
    /** TODO(contract): `src` is the legacy Supabase path, read only by the admin forms until uploads move to MEDIA_ROOT */
    image: Asset & { src?: string };
    genres: Genre[];
};
