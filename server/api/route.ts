import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './api-error';
import type { RouteContext, RouteHandler, RouteOptions, ErrorBody } from './route.types';
import { isProd } from '@/lib';

const toResponse = (body: unknown, status: number, options: RouteOptions) => {
    const headers = new Headers(options.headers);

    if (!options.pretty) {
        return NextResponse.json(body, { status, headers });
    }

    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify(body, null, 2), { status, headers });
};

/**
 * Wraps a route handler so every endpoint shares one response and error shape.
 * The handler's resolved value becomes the JSON body. A thrown `ApiError`
 * becomes its own status and message; anything else is logged server-side and
 * returned as a generic 500 so internals never reach the client.
 *
 * @example
 * export const GET = createRoute(getArtists);
 *
 * @example
 * export const GET = createRoute<Artist, { id: string }>(async (_request, { params }) => {
 *     const { id } = await params;
 *     const artist = await getArtist(id);
 *     if (!artist) throw new ApiError(404, 'Artist not found');
 *     return artist;
 * });
 *
 * @example
 * export const GET = createRoute(getStatus, {
 *     pretty: true,
 *     headers: { 'Cache-Control': 'no-store' },
 * });
 */
export const createRoute =
    <T, P extends Record<string, string> = Record<string, never>>(
        handler: RouteHandler<T, P>,
        options: RouteOptions = {}
    ) =>
    async (request: NextRequest, context: RouteContext<P>): Promise<Response> => {
        try {
            const data = await handler(request, context);
            return toResponse(data, options.status ?? 200, options);
        } catch (error) {
            if (error instanceof ApiError) {
                const body: ErrorBody = { message: error.message };
                return toResponse(body, error.status, options);
            }

            // Unknown failure: log the real error, return nothing revealing
            console.error('Route failed:', request.method, request.nextUrl.pathname, error);

            const body: ErrorBody = {
                message: 'Internal server error',
                ...(isProd ? {} : { detail: String(error) }),
            };
            return toResponse(body, 500, options);
        }
    };
