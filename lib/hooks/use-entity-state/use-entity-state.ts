import { DtoId } from '@/types/models/dto';
import { useState } from 'react';

type GenericData = {
    [key: string]: any;
};

type EntityType = GenericData[] & {
    id: number;
};

type DtoType = GenericData[] & {
    id: DtoId;
};

type UseEntityStateProps<T extends EntityType, U extends DtoType> = {
    data: T | U;
    onSubmit: (data: T) => void;
    addItem: (data: U) => void;
};
export const useEntityState = <T extends EntityType, U extends DtoType>({ data, onSubmit }: UseEntityStateProps<T, U>) => {
    // Manage Entities
    const [entities, setEntities] = useState<T[]>();

    // Manage DTOs
    const [dtos, setDtos] = useState<U[]>();

    // Initialize Data
};
