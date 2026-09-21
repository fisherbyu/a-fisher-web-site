import React from 'react';
import { TextInput } from 'thread-ui';
import { HandleInputChanges } from '@/lib';

// Form-only Album fields; list fields are comma-separated strings, split on submit
export type AlbumInfoData = {
    title: string;
    releaseDate: string;
    favoriteTracks: string;
    genres: string;
};

type AlbumInfoFormProps = {
    data: AlbumInfoData;
    onChange: (data: AlbumInfoData) => void;
};

export const AlbumInfoForm = ({ data, onChange }: AlbumInfoFormProps) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        HandleInputChanges(e, data, onChange);
    };

    return (
        <div>
            <TextInput
                name="title"
                title="Title"
                value={data.title}
                onChange={handleChange}
                required
            />
            <TextInput
                name="releaseDate"
                title="Release Date"
                value={data.releaseDate}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
            />

            <TextInput
                name="favoriteTracks"
                title="Favorite Tracks"
                value={data.favoriteTracks}
                onChange={handleChange}
                placeholder="Yellow, Spies, Trouble"
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
