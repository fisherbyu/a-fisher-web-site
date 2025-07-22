import { NavMenu, SideNav, SideNavItemProps } from 'thread-ui';
import Logo from '@/public/core/andrew-fisher-logo.svg';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const adminLinks: SideNavItemProps[] = [
        {
            title: 'Home',
            path: '/',
            icon: 'House',
        },
        {
            title: 'Artists',
            path: '/artist',
            icon: 'MusicNotes',
        },
        {
            title: 'Albums',
            path: '/album',
            icon: 'VinylRecord',
        },
    ];
    return (
        <div className="h-screen overflow-hidden">
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
            />{' '}
            <div className="h-full flex flex-row">
                <SideNav links={adminLinks} basePath="/admin" />
                {children}
            </div>
        </div>
    );
}
