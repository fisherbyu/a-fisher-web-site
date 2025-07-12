'use client';
import '@/public/styles/globals.css';
import { CoreMenu } from '@/components/old/core/core-menu';
import Logo from '@/public/core/andrew-fisher-logo.svg';

import CoreFooter from '@/components/old/core/core-footer';
import { NavMenu } from 'thread-ui';
import Link from 'next/link';
import Image from 'next/image';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavMenu
                logo={{ href: '/', logo: <Image src={Logo} alt="Andrew Fisher" className="cursor-pointer" /> }}
                items={[
                    { href: '/resume', title: 'Resume' },
                    { href: '/development', title: 'Development' },
                    { href: '/photo', title: 'Photography' },
                    { href: '/food', title: 'Food' },

                    {
                        title: 'Music',
                        items: [
                            { href: '/music/artists', title: 'Artists' },
                            { href: '/music/coldplay', title: 'Coldplay' },
                            { href: '/music/playlists', title: 'Playlists' },
                        ],
                    },
                ]}
            />
            {/* <CoreMenu /> */}
            <main className="flex-grow">{children}</main>
            <CoreFooter />
        </div>
    );
}
