import '@/public/styles/globals.css';
import type { Metadata } from 'next';
import { Merriweather_Sans } from 'next/font/google';

import { CoreMenu } from '@/components/old/core/core-menu';
import CoreFooter from '@/components/old/core/core-footer';

// Configure Site
const MAIN_FONT = Merriweather_Sans({ subsets: ['latin'] });

export let metadata: Metadata = {
    title: 'Andrew Fisher',
    description: 'Created by Andrew Fisher',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={MAIN_FONT.style}>
            <body className="flex flex-col min-h-screen">
                <CoreMenu />
                <main className="flex-grow">{children}</main>
                <CoreFooter />
            </body>
        </html>
    );
}
