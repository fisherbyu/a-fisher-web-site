import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
    // Define Route Constants
    const PROTECTED_ROUTE = '/admin';
    const AUTH_PAGE = '/sign-up';

    // Create an unmodified response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Initialize the Supabase client
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            },
        },
    });

    // Refresh session if expired - required for Server Components
    await supabase.auth.getUser();

    // Protect Admin Routes
    if (request.nextUrl.pathname.startsWith(PROTECTED_ROUTE) && !(await supabase.auth.getUser()).data.user) {
        return NextResponse.redirect(new URL(AUTH_PAGE, request.url));
    }

    if (request.nextUrl.pathname === AUTH_PAGE && (await supabase.auth.getUser()).data.user) {
        return NextResponse.redirect(new URL(PROTECTED_ROUTE, request.url));
    }

    return response;
};
