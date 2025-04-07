import { SideNav } from '@/components';
import { SideNavItemProps } from '@/components/layouts/navigation/side-nav/side-nav-item';

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
        <div className="flex h-screen overflow-hidden">
            <SideNav links={adminLinks} basePath="/admin" />
            {children}
        </div>
    );
}
