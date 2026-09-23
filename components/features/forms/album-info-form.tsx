import { TextInput } from 'thread-ui';
import { Album } from '@/types';
import { joinList } from '@/lib';

type AlbumInfoFormProps = {
    /** Existing album to prefill from; omit when creating */
    initialData?: Album;
};

/** Normalizes a stored date to the `YYYY-MM-DD` shape the input expects */
const toDateValue = (value?: string | Date | null) => {
    if (!value) return '';

    return value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10);
};

/**
 * Plain text fields for an Album. Uncontrolled: values are read from the
 * DOM as `FormData` when the parent form submits. List fields are
 * comma-separated here and split server-side.
 *
 * @example
 * <AlbumInfoForm initialData={album} />
 */
export const AlbumInfoForm = ({ initialData }: AlbumInfoFormProps) => {
    return (
        <div>
            <TextInput
                name="title"
                title="Title"
                defaultValue={initialData?.title ?? ''}
                required
            />
            <TextInput
                name="releaseDate"
                title="Release Date"
                defaultValue={toDateValue(initialData?.releaseDate)}
                placeholder="YYYY-MM-DD"
            />
            <TextInput
                name="favoriteTracks"
                title="Favorite Tracks"
                defaultValue={joinList(initialData?.favoriteTracks ?? [])}
                placeholder="Yellow, Spies, Trouble"
            />
            <TextInput
                name="genres"
                title="Genres"
                defaultValue={joinList(initialData?.genres.map(({ name }) => name) ?? [])}
                placeholder="Alternative, Rock"
            />
        </div>
    );
};
