import { SideNav } from '@/components';
import { SideNavItemProps } from '@/components/layouts/navigation/side-nav/side-nav-item';
import { CoreMenu } from '@/components/old/core/core-menu';

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
            <CoreMenu />
            <div className="h-full flex flex-row">
                <SideNav links={adminLinks} basePath="/admin" />
                {children}
            </div>
        </div>
    );
}
