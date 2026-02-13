'use client';
import { ThemeProvider } from 'thread-ui';
import { ThreadThemeConfig } from '@/thread.config';

export function Providers({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={ThreadThemeConfig}>{children}</ThemeProvider>;
}
