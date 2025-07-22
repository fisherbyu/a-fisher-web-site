import { Album, Artist } from '@/types';

export type MusicItemType = 'artist' | 'album';

export type MusicCardProps = {
    key: number;
    item: Artist | Album;
    type: MusicItemType;
};
