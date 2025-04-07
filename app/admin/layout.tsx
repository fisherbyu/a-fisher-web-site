import { SideNav } from '@/components';
import { SideNavItemProps } from '@/components/layouts/navigation/side-nav/side-nav-item';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const adminLinks: SideNavItemProps[] = [
        {
            title: 'Home',
            path: '/admin',
            icon: 'House',
        },
        {
            title: 'Artists',
            path: '/admin/artists',
            icon: 'MusicNotes',
        },
        {
            title: 'Album',
            path: '/admin/albums',
            icon: 'VinylRecord',
        },
    ];
    return (
        <div className="flex h-screen overflow-hidden">
            <SideNav links={adminLinks} />
            {children}
        </div>
    );
}
