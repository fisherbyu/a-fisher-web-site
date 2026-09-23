import { TextInput } from 'thread-ui';
import { Artist } from '@/types';

type LinkFormProps = {
    /** Existing artist to prefill from; omit when creating */
    initialData?: Artist;
};

/**
 * Streaming service links. Uncontrolled: values are read from the DOM as
 * `FormData` when the parent form submits.
 *
 * @example
 * <LinkForm initialData={artist} />
 */
export const LinkForm = ({ initialData }: LinkFormProps) => {
    return (
        <div className="flex flex-col gap-2">
            <TextInput
                name="appleURI"
                title="Apple Music"
                defaultValue={initialData?.link.appleURI ?? ''}
            />
            <TextInput
                name="spotifyURI"
                title="Spotify"
                defaultValue={initialData?.link.spotifyURI ?? ''}
            />
        </div>
    );
};
