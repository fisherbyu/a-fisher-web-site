import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    // Define Route Constants
    const AUTH_PAGE = '/login';
    const PROTECTED_ROUTE = '/admin';

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
            },
        },
    });

    // IMPORTANT: DO NOT ADD CODE HERE OR REMOVE auth.getUser()

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If User is not Authenticated when accessing a protected route, redirect to Login
    if (!user && request.nextUrl.pathname.startsWith(PROTECTED_ROUTE)) {
        return NextResponse.redirect(new URL(AUTH_PAGE, request.url));
    }

    // If User is Authenticated and trying to access the login page, redirect to admin
    if (user && request.nextUrl.pathname.startsWith(AUTH_PAGE)) {
        return NextResponse.redirect(new URL(PROTECTED_ROUTE, request.url));
    }
    return supabaseResponse;
}
