import { InfoCardProps } from '@/.yalc/thread-ui/dist';

export type Recipe = InfoCardProps & {
    id: string;
    type?: string;
    tags?: string[];
};
