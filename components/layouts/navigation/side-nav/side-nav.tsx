'use client';
import { SideNavItem } from './side-nav-item';
import { SideNavProps } from './side-nav.types';

/**
 * Standard User Dashboard for navigating between application views
 * @returns {JSX.Element} Standard Dashboard Menu
 */
export const SideNav = ({ logo, links, controls, basePath = '' }: SideNavProps) => {
    return (
        <nav className="md:min-w-64 lg:w-72 hidden sm:flex sm:flex-col justify-between px-4 pt-4 pb-8 border-r-2">
            <div className="space-y-8">
                {logo && logo}
                <div className="space-y-1.5">
                    {links.map((link) => (
                        <SideNavItem key={link.title} {...link} basePath={basePath} />
                    ))}
                </div>
            </div>
            {controls && <div className="space-y-4">{controls}</div>}
        </nav>
    );
};
