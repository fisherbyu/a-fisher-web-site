import { NavMenu } from 'thread-ui';
import Logo from '@/public/core/andrew-fisher-logo.svg';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
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
            <div className="flex-1 min-h-0">{children}</div>
        </div>
    );
}
