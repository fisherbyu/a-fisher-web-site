import { Input, Link } from '@/types';

export type Playlist = {
    id: number;
    title: string;
    link: Link;
};

export type PlaylistInput = Input<Playlist>;
