'use client';
import { MusicCard } from '@/components';
import { useAlbums } from '@/lib';

export default function AlbumContents() {
    const { albums, isLoading, error } = useAlbums();
    return <div>{albums?.map((album, _) => <MusicCard key={_} index={_} item={album} type="album" />)}</div>;
}
