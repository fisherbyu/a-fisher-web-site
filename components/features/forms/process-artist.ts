import { Artist, ArtistDto, AttributeDto, ContentDto } from '@/types';
import { useEffect } from 'react';

type ProcessArtistProps = {
    artist?: Artist;
    artistDto?: ArtistDto;
};

type ArtistPartial = {};

const saveContent = (data: ContentDto) => {};
const saveAttributes = (data: AttributeDto) => {};
const saveArtist = (data: Omit<Artist, 'content' | 'attributes' | 'link' | 'image'>) => {};
const createArtist = (data: ArtistDto) => {};

export const processArtist = ({ artist, artistDto }: ProcessArtistProps) => {
    // // Process updates to data
    // useEffect(() => {}, [artist]);

    // Return Functionality:
    const onSave = () => {
        if (artistDto) {
            createArtist(artistDto);
        } else if (artist) {
        }
    };
};
