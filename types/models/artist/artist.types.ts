import type { Album, Input, MusicItem } from '@/types';
import type { Prettify } from 'thread-ui';

export type Artist = Prettify<
    {
        id: number;
        name: string;
        contents: string[];
        favoriteTracks: string[];
        favoriteAlbums: string[];
        albums?: Album[];
    } & MusicItem
>;

export type ArtistInput = Omit<Input<Artist>, 'albums'>;
