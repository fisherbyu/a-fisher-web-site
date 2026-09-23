import { NextRequest } from 'next/server';
/** Route params, awaited by the handler (Next passes these as a promise) */
export type RouteContext<P> = {
    params: Promise<P>;
};

export type RouteHandler<T, P> = (request: NextRequest, context: RouteContext<P>) => Promise<T>;

export type RouteOptions = {
    /**
     * Success status code
     * @default `200`
     */
    status?: number;
    /** Extra response headers, e.g. `Cache-Control` */
    headers?: HeadersInit;
    /**
     * Indent the JSON body for human reading
     * @default `false`
     */
    pretty?: boolean;
};

/** Error body shape shared by every endpoint */
export type ErrorBody = {
    message: string;
    /** Raw error text; development only, never sent in production */
    detail?: string;
};
