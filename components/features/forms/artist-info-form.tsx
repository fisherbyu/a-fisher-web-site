import React from 'react';
import { Dropdown } from './dropdown';

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
                <label htmlFor="name" className="font-medium text-gray-700 mb-2">
                    Artist Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={data.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="tier" className="block font-medium text-gray-700">
                    Tier
                </label>
                <Dropdown id="tier" label="Tier" value={data.tier} options={tierOptions} required onSelect={() => null} />
                {/* <select
                    id="tier"
                    name="tier"
                    required
                    value={data.tier}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    {[...Array(5)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {`Tier ${index + 1}`}
                        </option>
                    ))}
                </select> */}
            </div>

            <div>
                <label htmlFor="rank" className="block text-sm font-medium text-gray-700">
                    Rank (optional)
                </label>
                <input
                    type="number"
                    id="rank"
                    name="rank"
                    value={data.rank ?? ''}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};
