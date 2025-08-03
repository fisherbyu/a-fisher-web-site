import { InfoCardProps } from '@/.yalc/thread-ui/dist';

export type Recipe = InfoCardProps & {
    type?: string;
    tags?: string[];
};
