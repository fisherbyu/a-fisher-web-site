'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icon } from 'thread-ui';
import { SideNavItemProps } from './side-nav-item.types';

export const SideNavItem = ({ title, path, icon, isMobile, onClick, isCollapsed = false }: SideNavItemProps) => {
    const pathname = usePathname();
    const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);

    return (
        <>
            {isMobile ? (
                <Link
                    href={path}
                    className="flex w-full items-center px-4 py-3 rounded-md hover:bg-primary hover:text-white gap-4"
                    onClick={onClick}
                >
                    <Icon color="black" name={icon} size={24} />
                    <p className="">{title}</p>
                </Link>
            ) : (
                <Link
                    href={path}
                    className={`flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-white gap-2 
				${isActive ? 'text-white bg-primary' : ''}`}
                >
                    <Icon color="black" name={icon} size={24} />
                    {isCollapsed ? null : <p className="text-sm md:block hidden">{title}</p>}
                </Link>
            )}
        </>
    );
};
