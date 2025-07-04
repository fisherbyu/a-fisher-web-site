import { DtoId } from '../dto';

export type Link = {
    id: number;
    appleURI: string;
    spotifyURI: string;
};

export type LinkDto = Omit<Link, 'id'> & {
    id: DtoId;
};
