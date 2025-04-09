import '@/public/styles/globals.css';
import { CoreMenu } from '@/components/old/core/core-menu';
import CoreFooter from '@/components/old/core/core-footer';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <CoreMenu />
            <main className="flex-grow">{children}</main>
            <CoreFooter />
        </div>
    );
}
