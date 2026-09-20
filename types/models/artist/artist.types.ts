import {
    Album,
    Attribute,
    AttributeDto,
    Content,
    ContentDto,
    Image,
    ImageDto,
    Link,
    LinkDto,
    MusicItem,
} from '@/types';
import { DtoId } from '../dto';
import { Prettify } from 'thread-ui';

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
