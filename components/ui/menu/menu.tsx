'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/core/andrew-fisher-logo.svg';

interface Link {
    title: string;
    href: string;
}

const links: { title: string; href: string }[] = [
    {
        title: 'Resume',
        href: '/resume',
    },
    {
        title: 'Development',
        href: '/development',
    },
    {
        title: 'Photography',
        href: '/photo',
    },
    {
        title: 'Food',
        href: '/food',
    },
];

const musicLinks: { title: string; href: string }[] = [
    {
        title: 'Artists',
        href: '/music/artists',
    },
    {
        title: 'Coldplay',
        href: '/music/coldplay',
    },
    {
        title: 'Playlists',
        href: '/music/playlists',
    },
];

export function Menu() {
    // Navmenu Controls
    const [navIsOpened, setNavIsOpened] = useState(false);
    const closeNavbar = () => {
        setNavIsOpened(false);
    };
    const toggleNavbar = () => {
        setNavIsOpened((navIsOpened) => !navIsOpened);
    };

    // Dropdown Control
    const [isDropdownHovered, setIsDropdownHovered] = useState(false);
    const handleMusicHover = (hovered: boolean) => {
        setIsDropdownHovered(hovered);
    };

    useEffect(() => {
        const onResize = () => {
            closeNavbar();
        };

        window.addEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            // Check if the click is outside of the menu
            const menu = document.getElementById('site-menu');
            const isClickInsideMenu = menu && menu.contains(event.target as Node);

            if (!isClickInsideMenu) {
                console.log('out');
                console.log('Close Here');
                closeNavbar();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    // Style Constants
    const NavItemBasic: string =
        'inline-flex h-10 items-center justify-center rounded-md bg-background text-sm font-medium transition-colors';
    const NavItemHover: string = 'hover:bg-accent hover:text-accent-foreground';
    const LogoStyles: string = `${NavItemBasic} ${NavItemHover}    w-fit `;
    const NavItemSpacing: string = `px-4 py-2 w-full `;
    const NavItem: string = `${NavItemBasic} ${NavItemHover} ${NavItemSpacing}    `; //lg:w-fit
    const DropdownItem: string = `${NavItemBasic} ${NavItemHover} ${NavItemSpacing} `; //lg:w-8/12

    return (
        <>
            <style jsx>
                {`
                    details summary::-webkit-details-marker {
                        display: none;
                    }

                    summary {
                        list-style: none;
                    }
                `}
            </style>
            <header
                id="site-menu"
                className="sticky top-0 w-full flex items-center h-20 border-b border-b-gray-100 dark:border-b-gray-900 z-40 bg-white dark:bg-gray-950/80 backdrop-filter backdrop-blur-xl"
            >
                <nav className=" container relative mx-auto w-full flex gap-x-5 justify-between lg:justify-start items-center">
                    <div className="flex items-center w-96 max-w-fit ">
                        <Link onClick={closeNavbar} href="/" passHref className={LogoStyles}>
                            <Image src={Logo} alt="Andrew Fisher" className="cursor-pointer" />
                        </Link>
                    </div>
                    <div
                        className={`
                            absolute top-full left-0 bg-white dark:bg-gray-950 lg:bg-transparent border-b border-gray-200 dark:border-gray-800 py-8 lg:py-0 px-5 sm:px-10 md:px-12 lg:px-0 lg:border-none w-full lg:top-0 lg:relative lg:w-max lg:flex md:transition-none gap-x-6
                            ${navIsOpened ? 'duration-300 ease-linear visible opacity-100 translate-y-0' : 'duration-300 ease-linear translate-y-10 opacity-0 invisible lg:visible lg:translate-y-0 lg:opacity-100'}
                        `}
                    >
                        <ul className="flex flex-col lg:flex-row gap-6 lg:items-center text-gray-700 dark:text-gray-300 lg:w-full lg:justify-center">
                            {links.map((link) => (
                                <li key={link.title}>
                                    <Link onClick={closeNavbar} href={link.href} className={NavItem}>
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                            <li className="" onMouseEnter={() => handleMusicHover(true)} onMouseLeave={() => handleMusicHover(false)}>
                                <details className="list-none" open={isDropdownHovered}>
                                    <summary>
                                        <button
                                            className={`${NavItem} ${isDropdownHovered ? 'bg-accent text-accent-foreground' : ''}`}
                                        >
                                            Music
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={` relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open] ${isDropdownHovered ? 'rotate-180' : ''}`}
                                            >
                                                <path d="m6 9 6 6 6-6"></path>
                                            </svg>
                                        </button>
                                    </summary>
                                    <div className="w-full lg:fixed ">
                                        <ul className="flex flex-row gap-6 justify-center lg:gap-3 lg:flex-col lg:w-36 lg:bg-white lg:p-5 lg:border  lg:-translate-x-8 lg:translate-y-8 rounded-md ">
                                            {musicLinks.map((link) => (
                                                <li className="flex justify-center" key={link.title}>
                                                    <Link
                                                        onClick={closeNavbar}
                                                        href={link.href}
                                                        className={`${DropdownItem} lg:mx-auto`}
                                                    >
                                                        {link.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </details>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => {
                                toggleNavbar();
                            }}
                            aria-label="toggle navbar"
                            className="outline-none border-l border-l-gray-100 dark:border-l-gray-800 pl-3 relative py-3"
                        >
                            <span
                                aria-hidden={true}
                                className={`
                                flex h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
                                ${navIsOpened ? 'rotate-45 translate-y-[.324rem]' : ''}
                            `}
                            ></span>
                            <span
                                aria-hidden={true}
                                className={`
                                mt-2 flex h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
                                ${navIsOpened ? '-rotate-45 -translate-y-[.324rem]' : ''}
                            `}
                            />
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
}
