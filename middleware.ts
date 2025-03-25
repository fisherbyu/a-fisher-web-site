import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib';

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

// Configure middleware to only run on admin routes
export const config = {
    matcher: [
        '/admin/:path*', // Protect admin routes
        '/sign-in', // Check auth status on sign-in page
    ],
};
