import { Link } from '@/types';
import { DtoId } from '../dto';

export type Playlist = {
    id: number;
    title: string;
    link?: Link;
};

export type PlaylistDto = Omit<Playlist, 'id'> & {
    id: DtoId;
};
