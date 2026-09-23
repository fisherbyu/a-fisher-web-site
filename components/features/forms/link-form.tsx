import { TextInput } from 'thread-ui';
import { Link } from '@/types';

type LinkFormProps = {
    /** Existing link to prefill from; omit when creating */
    initialData?: Link;
};

/**
 * Streaming service links. Uncontrolled: values are read from the DOM as
 * `FormData` when the parent form submits.
 *
 * @example
 * <LinkForm initialData={album.link} />
 */
export const LinkForm = ({ initialData }: LinkFormProps) => {
    return (
        <div className="flex flex-col gap-2">
            <TextInput
                name="appleURI"
                title="Apple Music"
                defaultValue={initialData?.appleURI ?? ''}
            />
            <TextInput
                name="spotifyURI"
                title="Spotify"
                defaultValue={initialData?.spotifyURI ?? ''}
            />
        </div>
    );
};
