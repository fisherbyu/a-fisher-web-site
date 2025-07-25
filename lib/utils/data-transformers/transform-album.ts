import { Album } from '@/types';

export type PrismaAlbum = {
    id: number;
    name: string;
    rank: number | null;
    createdAt: Date;
    updatedAt: Date;
    contents: {
        id: number;
        order: number;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        artistId: number | null;
        albumId: number | null;
    }[];
    attributes: {
        id: number;
        order: number;
        text: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        artistId: number | null;
        albumId: number | null;
    }[];
    link: {
        id: number;
        appleURI: string;
        spotifyURI: string;
        createdAt: Date;
        updatedAt: Date;
        artistId: number | null;
        albumId: number | null;
        playlistId: number | null;
    } | null;
    image: {
        id: number;
        src: string;
        alt: string;
        height: number;
        width: number;
        createdAt: Date;
        updatedAt: Date;
        artistId: number | null;
        albumId: number | null;
    } | null;
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
