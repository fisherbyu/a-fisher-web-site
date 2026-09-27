import { InfoCardProps } from 'thread-ui';

export type Recipe = InfoCardProps & {
    id: string;
    type?: string;
    tags?: string[];
};
