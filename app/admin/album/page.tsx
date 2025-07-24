import AlbumContents from './contents';
import { Metadata } from 'next';

export let metadata: Metadata = {
    title: 'Manage Albums',
};
export default function ArtistAdmin() {
    return <AlbumContents />;
}
