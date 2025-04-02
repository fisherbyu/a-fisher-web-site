import { TextInput } from '@/components/ui';
import { HandleInputChanges } from '@/lib';
import { Link } from '@/types';

type LinkData = Omit<Link, 'id'>;

type LinkFormProps = {
    data: LinkData;
    onChange: (data: LinkData) => void;
};

export const LinkForm = ({ data, onChange }: LinkFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        HandleInputChanges(e, data, onChange);
    };

    return (
        <div>
            <TextInput name="appleURI" title="Apple URI" value={data.appleURI} onChange={handleChange} required />
            <TextInput name="spotifyURI" title="Spotify URI" value={data.spotifyURI} onChange={handleChange} required />
        </div>
    );
};
