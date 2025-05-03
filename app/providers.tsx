'use client';
import { ThemeProvider } from 'thread-ui';
import { ThreadTheme } from '@/thread.config';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider initialTheme={ThreadTheme} initialMode="light">
            {children}
        </ThemeProvider>
    );
}
