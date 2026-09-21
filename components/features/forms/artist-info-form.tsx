import React from 'react';
import { TextInput } from '@/components';
import { HandleInputChanges } from '@/lib';

// Form-only Artist fields; list fields are comma-separated strings, split on submit
export type ArtistInfoData = {
    name: string;
    favoriteTracks: string;
    favoriteAlbums: string;
    genres: string;
};

type ArtistInfoFormProps = {
    data: ArtistInfoData;
    onChange: (data: ArtistInfoData) => void;
};

export const ArtistInfoForm = ({ data, onChange }: ArtistInfoFormProps) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        HandleInputChanges(e, data, onChange);
    };

    return (
        <div>
            <TextInput
                name="name"
                title="Name"
                value={data.name}
                onChange={handleChange}
                required
            />
            <TextInput
                name="favoriteTracks"
                title="Favorite Tracks"
                value={data.favoriteTracks}
                onChange={handleChange}
                placeholder="Yellow, Up&Up, Coloratura"
            />
            <TextInput
                name="favoriteAlbums"
                title="Favorite Albums"
                value={data.favoriteAlbums}
                onChange={handleChange}
                placeholder="Parachutes, X&Y"
            />
            <TextInput
                name="genres"
                title="Genres"
                value={data.genres}
                onChange={handleChange}
                placeholder="Alternative, Rock"
            />
        </div>
    );
};
