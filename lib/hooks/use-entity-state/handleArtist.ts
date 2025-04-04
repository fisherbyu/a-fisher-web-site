import { Artist, ArtistDto } from '@/types';
import { useId } from 'react';

type HandleArtistUpdates = {
    data?: Artist;
    createArtist: (data: ArtistDto) => void;
    saveArtist: (data: Artist) => void;
};

export const handleArtist = ({ data, createArtist, saveArtist }: HandleArtistUpdates) => {
    // Initialize Entity
    const entity: Artist | undefined = data;
    const dto: ArtistDto | undefined = data
        ? undefined
        : {
              id: useId(),
              name: '',
              tier: 0,
              contents: [],
              attributes: [],
          };

    // Save Data
    const processData = () => {
        if (entity) {
            saveArtist(entity);

            for (const key in entity) {
            }
        } else if (dto) {
            createArtist(dto);
        }
    };
};
