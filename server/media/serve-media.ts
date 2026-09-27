import 'server-only';
import type { NextRequest } from 'next/server';
// Not the '@/lib' barrel: it pulls in client hooks, which break standalone scripts importing this module
import { isProd } from '@/lib/utils/env';
import { readMediaFile } from './storage';

type MediaRouteContext = { params: Promise<{ path: string[] }> };

// Keys are immutable, so a file at a given path never changes
const IMMUTABLE = 'public, max-age=31536000, immutable';

// Only generated variants are served; anything else in MEDIA_ROOT stays private
const CONTENT_TYPES: Record<string, string> = { webp: 'image/webp' };

// 404s must not be cached, or a file synced later would stay hidden behind Cloudflare
const notFound = () => new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });

const isMissingFile = (error: unknown) =>
    error instanceof Error && 'code' in error && (error.code === 'ENOENT' || error.code === 'EISDIR');

/**
 * In dev, fetches a file the laptop doesn't have from the deployed site,
 * so prod uploads render locally without running a sync first.
 * Enabled by `MEDIA_FALLBACK_ORIGIN`, e.g. `https://fisherandrew.org`.
 */
const fetchFromFallback = async (relativePath: string) => {
    const origin = process.env.MEDIA_FALLBACK_ORIGIN;
    if (isProd || !origin) return null;

    const response = await fetch(`${origin}/media/${relativePath}`).catch(() => null);
    if (!response?.ok || !response.body) return null;

    return new Response(response.body, {
        headers: {
            'Content-Type': response.headers.get('Content-Type') ?? 'application/octet-stream',
            'Cache-Control': IMMUTABLE,
        },
    });
};

/**
 * Streams asset variants from MEDIA_ROOT for `/media/[...path]`.
 *
 * @example
 * // app/media/[...path]/route.ts
 * export const GET = serveMedia;
 */
export const serveMedia = async (_request: NextRequest, { params }: MediaRouteContext): Promise<Response> => {
    const { path } = await params;
    const relativePath = path.join('/');

    const contentType = CONTENT_TYPES[relativePath.split('.').pop() ?? ''];
    if (!contentType) return notFound();

    try {
        const data = await readMediaFile(relativePath);
        return new Response(new Uint8Array(data), {
            headers: { 'Content-Type': contentType, 'Cache-Control': IMMUTABLE },
        });
    } catch (error) {
        if (isMissingFile(error)) return (await fetchFromFallback(relativePath)) ?? notFound();
        // Path traversal attempts throw from resolveMediaPath; don't reveal why
        if (error instanceof Error && error.message.startsWith('Path escapes')) return notFound();
        throw error;
    }
};
