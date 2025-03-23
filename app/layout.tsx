import type { Metadata } from 'next';
import { Merriweather_Sans } from 'next/font/google';
import '@/public/styles/globals.css';

import { CoreMenu } from '@/components/old/core/core-menu';
import CoreFooter from '@/components/old/core/core-footer';

const coreFont = Merriweather_Sans({ subsets: ['latin'] });

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
        <html lang="en">
            <body className={coreFont.className}>
                <CoreMenu />
                {children}
                <CoreFooter />
            </body>
        </html>
    );
}
