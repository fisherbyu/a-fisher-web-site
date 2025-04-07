import { ReactNode } from 'react';
import { SideNavItemProps } from './side-nav-item';

export type SideNavProps = {
    logo?: ReactNode;
    links: SideNavItemProps[];
    controls?: ReactNode;
};
