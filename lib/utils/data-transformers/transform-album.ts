import { Album } from '@/types';

export type PrismaAlbum = {
    name: string;
    id: number;
    rank: number;
    createdAt: Date;
    updatedAt: Date;
    link: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        artistId: number | null;
        albumId: number | null;
        appleURI: string;
        spotifyURI: string;
        playlistId: number | null;
    } | null;
    image: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        artistId: number | null;
        albumId: number | null;
        src: string;
        alt: string;
        height: number;
        width: number;
    } | null;
    contents: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        text: string;
        artistId: number | null;
        albumId: number | null;
    }[];
    attributes: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        text: string;
        artistId: number | null;
        albumId: number | null;
    }[];
};

export const transformAlbum = (data: PrismaAlbum): Album => {
    return {
        id: data.id,
        name: data.name,
        rank: data.rank ?? undefined,
        contents: data.contents,
        attributes: data.attributes,
        link: {
            id: data.link!.id,
            appleURI: data.link!.appleURI,
            spotifyURI: data.link!.spotifyURI,
        },
        image: {
            id: data.image!.id,
            src: data.image!.src,
            alt: data.image!.alt,
            height: data.image!.height,
            width: data.image!.width,
        },
    };
};
