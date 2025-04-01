import React from 'react';
import { Dropdown } from '@/components';
import { TextInput } from '@/components/ui/form-elements/text-input/text-input';

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
        const { name, value, type } = e.target as HTMLInputElement;

        let parsedValue: string | number | undefined = value;

        // Handle numeric inputs
        if (type === 'number') {
            parsedValue = value === '' ? undefined : Number(value);
        }

        onChange({
            ...data,
            [name]: parsedValue,
        });
    };

    return (
        <div className="space-y-4 max-w-56">
            <div>
                <TextInput name="name" title="Name" value={data.name} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
                <Dropdown label="Tier" value={data.tier} options={tierOptions} onSelect={() => null} />
            </div>

            <div>
                <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-2">
                    Rank (optional)
                </label>
                <input
                    type="number"
                    id="rank"
                    name="rank"
                    value={data.rank ?? ''}
                    onChange={handleChange}
                    min="1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
        </div>
    );
};
