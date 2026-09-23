import 'server-only';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../clients';
import { ApiError } from '../api';

/**
 * Reads the current Supabase user from request cookies.
 * Returns `null` when nobody is signed in.
 *
 * @example
 * const user = await getUser();
 * if (user) { ... }
 */
export const getUser = async () => {
    const supabase = await createSupabaseServerClient();

    // getUser revalidates the token with Supabase; getSession trusts the cookie
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
};

/**
 * Guard for Server Actions and pages. Sends anonymous callers to the login
 * page rather than returning an error, since they're driving a UI.
 *
 * @example
 * export const createArtistAction = async (prevState, formData) => {
 *     await requireAdmin();
 *     ...
 * };
 *
 * @throws Redirects to `/login` when no user is signed in
 */
export const requireAdmin = async () => {
    const user = await getUser();
    if (!user) redirect('/login');

    return user;
};

/**
 * Guard for API route handlers. Returns a 401 through `createRoute` instead
 * of redirecting, since callers are consuming JSON rather than rendering.
 *
 * @example
 * export const POST = createRoute(async (request) => {
 *     await requireApiAdmin();
 *     ...
 * });
 *
 * @throws {ApiError} 401 when no user is signed in
 */
export const requireApiAdmin = async () => {
    const user = await getUser();
    if (!user) throw new ApiError(401, 'Authentication required');

    return user;
};
