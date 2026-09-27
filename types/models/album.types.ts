import type { Artist, AssetInput, Input, MusicItem } from '@/types';
import type { Prettify } from 'thread-ui';

export type Album = Prettify<
    {
        id: number;
        title: string;
        releaseDate?: Date;
        contents: string[];
        favoriteTracks: string[];
        artistId: Artist['id'];
    } & MusicItem
>;

export type AlbumInput = Prettify<Omit<Input<Album>, 'image'> & { image: AssetInput }>;
