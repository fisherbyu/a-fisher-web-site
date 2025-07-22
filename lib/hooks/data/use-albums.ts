import { fetchAlbums } from '@/lib/actions';
import useSWR from 'swr';

export const useAlbums = () => {
    const { data, error, isLoading } = useSWR('/album', fetchAlbums);
    return {
        albums: data?.data,
        isLoading,
        error,
    };
};
