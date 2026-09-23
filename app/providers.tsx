'use client';
import { ThreadProvider } from 'thread-ui';
import Link from 'next/link';
import { SWRConfig } from 'swr';
import { makeRequest } from '@/lib';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThreadProvider linkComponent={Link}>
            <SWRConfig value={{ fetcher: makeRequest }}>{children}</SWRConfig>
        </ThreadProvider>
    );
}
