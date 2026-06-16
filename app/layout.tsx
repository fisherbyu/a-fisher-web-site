import '@/public/styles/globals.css';
import 'thread-ui/thread.css';
import { ThreadTheme, ThreadScript } from 'thread-ui';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Noto_Sans, Libre_Baskerville, Victor_Mono } from 'next/font/google';

const heading = Libre_Baskerville({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-heading',
});

const body = Noto_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-body',
});

const mono = Victor_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-mono',
});

const fontVariables = `${heading.variable} ${body.variable} ${mono.variable}`;

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
        <html lang="en" className={fontVariables} suppressHydrationWarning>
            <head>
                <ThreadScript defaultMode="system" />
            </head>
            <body style={{ backgroundColor: ThreadTheme.surface }}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
