import { NavMenu, Footer } from 'thread-ui';
import Link from 'next/link';
import { AndrewFisherLogo } from '@/components';
import { AFLogo } from '@/components';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavMenu
                logo={{ href: '/', logo: <AndrewFisherLogo /> }}
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
            <main className="flex-grow">{children}</main>
            <Footer
                caption="Created By Andrew Fisher"
                logo={
                    <Link href="/">
                        <AFLogo />
                    </Link>
                }
                githubLink="https://github.com/fisherbyu"
                linkedInLink="https://www.linkedin.com/in/fisherandrew777/"
            />
        </div>
    );
}
