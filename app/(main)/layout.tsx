import Logo from '@/public/core/andrew-fisher-logo.svg';
import AFLogo from '@/public/core/af-logo.svg';
import { NavMenu, Footer } from 'thread-ui';
import Image from 'next/image';
import Link from 'next/link';

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
            <main className="flex-grow">{children}</main>
            <Footer
                caption="Created By Andrew Fisher"
                logo={
                    <Link href="/">
                        <Image src={AFLogo} alt="AF Logo" />
                    </Link>
                }
                githubLink="https://github.com/fisherbyu"
                linkedInLink="https://www.linkedin.com/in/fisherandrew777/"
            />
        </div>
    );
}
