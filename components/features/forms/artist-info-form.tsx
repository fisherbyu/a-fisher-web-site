import { TextInput } from 'thread-ui';
import { Artist } from '@/types';
import { joinList } from '@/lib';

type ArtistInfoFormProps = {
    /** Existing artist to prefill from; omit when creating */
    initialData?: Artist;
};

/**
 * Plain text fields for an Artist. Uncontrolled: values are read from the
 * DOM as `FormData` when the parent form submits. List fields are
 * comma-separated here and split server-side.
 *
 * @example
 * <ArtistInfoForm initialData={artist} />
 */
export const ArtistInfoForm = ({ initialData }: ArtistInfoFormProps) => {
    return (
        <div className="flex flex-col gap-2">
            <TextInput name="name" title="Name" defaultValue={initialData?.name ?? ''} required />
            <TextInput
                name="favoriteTracks"
                title="Favorite Tracks"
                defaultValue={joinList(initialData?.favoriteTracks ?? [])}
            />
            <TextInput
                name="favoriteAlbums"
                title="Favorite Albums"
                defaultValue={joinList(initialData?.favoriteAlbums ?? [])}
            />
            <TextInput
                name="genres"
                title="Genres"
                defaultValue={joinList(initialData?.genres.map(({ name }) => name) ?? [])}
            />
        </div>
    );
};
