import { Metadata } from 'next';
import PlaylistContent from './content';

export let metadata: Metadata = {
    title: 'Manage Playlists',
};

export default function PlaylistAdmin() {
    return <PlaylistContent />;
}
