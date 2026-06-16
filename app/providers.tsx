'use client';
import { ThreadProvider } from 'thread-ui';
import Link from 'next/link';

export function Providers({ children }: { children: React.ReactNode }) {
    return <ThreadProvider linkComponent={Link}>{children}</ThreadProvider>;
}
