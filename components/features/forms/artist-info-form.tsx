import React from 'react';
import { Dropdown, NumberInput, TextInput } from '@/components';
import { HandleInputChanges } from '@/lib';

type ArtistInfoData = {
    name: string;
    tier: number;
    rank: number | undefined;
};

type ArtistInfoFormProps = {
    data: ArtistInfoData;
    onChange: (data: ArtistInfoData) => void;
};

export const ArtistInfoForm = ({ data, onChange }: ArtistInfoFormProps) => {
    const tierOptions = [...Array(5)].map((_, index) => ({ label: `Tier ${index + 1}`, value: index + 1 }));
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        HandleInputChanges(e, data, onChange);
    };

    // const handleTierChange = (selectedValue: number) => {
    //     onChange({
    //         ...data,
    //         tier: selectedValue,
    //     });
    // };

    return (
        <div>
            <div>
                <TextInput name="name" title="Name" value={data.name} onChange={handleChange} required />
                <NumberInput name="rank" title="Rank" value={data.rank} onChange={handleChange} required />
                <Dropdown label="Tier" value={data.tier} options={tierOptions} onSelect={() => null} />
            </div>
        </div>
    );
};
