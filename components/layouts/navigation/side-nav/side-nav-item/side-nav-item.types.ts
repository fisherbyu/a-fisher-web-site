import { IconNames } from 'thread-ui';

export type SideNavItemProps = {
    title: string;
    path: string;
    icon: IconNames;
    isMobile?: boolean;
    isCollapsed?: boolean;
    onClick?: () => void;
};
