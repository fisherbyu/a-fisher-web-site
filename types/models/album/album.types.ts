import type { MusicItem } from '@/types';
import type { Prettify } from 'thread-ui';

export type Album = Prettify<
    {
        id: number;
        title: string;
        releaseDate: Date;
        contents: string[];
        favoriteTracks: string[];
    } & MusicItem
>;
