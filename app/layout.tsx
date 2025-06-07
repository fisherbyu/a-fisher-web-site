import '@/public/styles/globals.css';
import type { Metadata } from 'next';
import { Merriweather_Sans } from 'next/font/google';
import { Providers } from './providers';
import { ThreadTheme } from 'thread-ui';

// Configure Site
const MAIN_FONT = Merriweather_Sans({ subsets: ['latin'] });
const background = ThreadTheme.background;

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
            <Providers>
                <body style={{ backgroundColor: background }}>{children}</body>
            </Providers>
        </html>
    );
}
