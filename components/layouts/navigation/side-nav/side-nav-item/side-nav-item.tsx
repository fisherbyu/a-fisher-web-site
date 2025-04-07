'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icon } from 'thread-ui';
import { SideNavItemProps } from './side-nav-item.types';

export const SideNavItem = ({ title, path, icon, isMobile, onClick, isCollapsed = false, basePath = '' }: SideNavItemProps) => {
    const currentPath = usePathname();
    const fullPath = path === '/' && basePath ? basePath : `${basePath}${path}`;
    const isActive = path === '/' ? currentPath === fullPath : currentPath.startsWith(fullPath);

    return (
        <>
            {isMobile ? (
                <Link
                    href={fullPath}
                    className="flex w-full items-center px-4 py-3 rounded-md hover:bg-primary hover:text-white gap-4"
                    onClick={onClick}
                >
                    <Icon color="black" name={icon} size={24} />
                    <p className="">{title}</p>
                </Link>
            ) : (
                <Link
                    href={fullPath}
                    className={`flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-white gap-2
            ${isActive ? 'text-white bg-primary' : ''}`}
                >
                    <Icon color={'black'} name={icon} size={24} />
                    {isCollapsed ? null : <p className="text-sm md:block hidden">{title}</p>}
                </Link>
            )}
        </>
    );
};
