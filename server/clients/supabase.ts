import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a request-scoped Supabase client backed by the Next.js cookie store.
 * Server-only: use in server components, route handlers, or Server Actions.
 *
 * @example
 * const supabase = await createSupabaseServerClient();
 * const { data } = await supabase.auth.getUser();
 */
export const createSupabaseServerClient = async () => {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(
                    cookiesToSet: {
                        name: string;
                        value: string;
                        options?: Record<string, unknown>;
                    }[]
                ) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch (error) {
                        console.log('Error Initializing Server Client:', error);
                    }
                },
            },
        }
    );
};
