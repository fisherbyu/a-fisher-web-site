import React from 'react';
import { Dropdown, NumberInput, TextInput } from '@/components';
import { HandleInputChanges } from '@/lib';

export type AlbumInfoData = {
    name: string;
    rank?: number;
};

type AlbumInfoFormProps = {
    data: AlbumInfoData;
    onChange: (data: AlbumInfoData) => void;
};

export const AlbumInfoForm = ({ data, onChange }: AlbumInfoFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        HandleInputChanges(e, data, onChange);
    };

    return (
        <div>
            <TextInput name="name" title="Name" value={data.name} onChange={handleChange} required />
            <div className="grid grid-cols-2">
                <NumberInput name="rank" title="Rank" value={data.rank} onChange={handleChange} required min={1} max={5} />
            </div>
        </div>
    );
};
