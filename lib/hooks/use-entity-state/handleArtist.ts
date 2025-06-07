import { Artist, ArtistDto } from '@/types';
import { useId } from 'react';

type HandleArtistUpdates<T extends { id: number }, D extends { id: string }> = {
    data?: T;
    dto?: D;
    // Create Full Model from DTO
    createEntity: (data: D) => void;
    // Save Existent Model
    saveEntity: (data: T) => void;
    // Save Existant Model Attributes
    attributeHandlers: {
        [K in keyof T]?: {
            // value: T[K];
            onChange: (newValue: T[K]) => void;
        };
    };
    // Add new Attribute to Existent Model
    attributeCreators: {
        [K in keyof T]?: {
            onChange: (newValue: D & { parentId: number }) => void;
        };
    };
};

// saveAttributes: SubAttributes<T> & SubAttributeHandler<keyof T>[];

type SubAttributes<T> = {
    [K in keyof T]: any;
};

type SubAttributeHandler<K> = {
    onChange: (data: K) => void;
};

export const handleArtist = <T extends { id: number }, D extends { id: string }>({
    data,
    dto,
    createEntity,
    saveEntity,
    attributeHandlers,
}: HandleArtistUpdates<T, D>) => {
    // Is Data New or Existant
    const isNew = dto ? true : false;

    // Save Data
    const processData = () => {
        if (data) {
            saveEntity(data);

            for (const key in attributeHandlers) {
                const handler = attributeHandlers[key];
                handler?.onChange(data[key]);
            }
        } else if (dto) {
            createEntity(dto);
        }
    };
};
