import '@/public/styles/globals.css';
import 'thread-ui/thread.css';
import { ThreadTheme, ThreadScript, ThemeProvider } from 'thread-ui';
import type { Metadata } from 'next';
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

const code = Victor_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-code',
});

const fontVariables = `${heading.variable} ${body.variable} ${code.variable}`;

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
                <ThemeProvider
                    theme={{
                        typography: {
                            fontFamilies: {
                                heading: `var(--font-heading)`,
                                body: `var(--font-body)`,
                            },
                        },
                    }}
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
