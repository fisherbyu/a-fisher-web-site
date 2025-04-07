import React from 'react';
import { Dropdown, NumberInput, TextInput } from '@/components';
import { HandleInputChanges } from '@/lib';

export type ArtistInfoData = {
    name: string;
    tier: number;
    rank?: number;
};

type ArtistInfoFormProps = {
    data: ArtistInfoData;
    onChange: (data: ArtistInfoData) => void;
};

export const ArtistInfoForm = ({ data, onChange }: ArtistInfoFormProps) => {
    const tierOptions = [...Array(5)].map((_, index) => ({ label: `Tier ${index + 1}`, value: index + 1 }));
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        HandleInputChanges(e, data, onChange);
    };

    const handleTierChange = (value: number | string) => {
        // Create updated data object with the new tier value
        const updatedData = {
            ...data,
            tier: value as number,
        };
        // Pass the updated data to the parent component
        onChange(updatedData);
    };

    return (
        <div>
            <TextInput name="name" title="Name" value={data.name} onChange={handleChange} required />
            <div className="grid grid-cols-2">
                <NumberInput name="rank" title="Rank" value={data.rank} onChange={handleChange} required min={1} max={5} />
                <Dropdown label="Tier" value={data.tier} options={tierOptions} onSelect={handleTierChange} />
            </div>
        </div>
    );
};
