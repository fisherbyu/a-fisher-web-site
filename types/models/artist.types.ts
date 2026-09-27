import type { Album, ImageUpload, Input, MusicItem } from '@/types';
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

export type ArtistInput = Prettify<Omit<Input<Artist>, 'albums' | 'image'> & { image: ImageUpload }>;
