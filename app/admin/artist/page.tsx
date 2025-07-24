import ArtistContents from './contents';
import { Metadata } from 'next';

export let metadata: Metadata = {
    title: 'Manage Artists',
};
export default function ArtistAdmin() {
    return <ArtistContents />;
}
