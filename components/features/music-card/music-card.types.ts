import { Album, Artist } from '@/types';

export type MusicItemType = 'artist' | 'album';

export type MusicCardProps = {
    index: number;
    item: Artist | Album;
    type: MusicItemType;
};
