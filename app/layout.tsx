import '@/public/styles/globals.css';
import { ThreadTheme } from 'thread-ui';
import type { Metadata } from 'next';
import { Merriweather_Sans } from 'next/font/google';

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
            <body style={{ backgroundColor: ThreadTheme.background }}>{children}</body>
        </html>
    );
}
