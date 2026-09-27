/** Error thrown for any non-2xx response; carries the status and parsed body */
export class RequestError extends Error {
    /** HTTP status code of the failed response */
    status: number;
    /** Parsed response body, when the server returned JSON */
    info?: unknown;

    constructor(status: number, message: string, info?: unknown) {
        super(message);
        this.name = 'RequestError';
        this.status = status;
        this.info = info;
    }
}

/**
 * Shared request function for SWR and one-off client calls.
 * Throws `RequestError` on any non-2xx response, reading the `message`
 * field for internal API returns and falling back to the status text for external APIs.
 *
 * @example
 * const { data } = useSWR<Artist[]>('/api/artist', makeRequest);
 *
 * @example
 * const artist = await makeRequest<Artist>('/api/artist/123');
 */
export const makeRequest = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, init);

    if (!response.ok) {
        // Body may not be JSON (proxy errors, external APIs), so never assume
        const info = await response.json().catch(() => undefined);
        const message =
            (info as { message?: string })?.message ?? response.statusText ?? 'Request failed';

        throw new RequestError(response.status, message, info);
    }

    // 204 and other empty bodies have nothing to parse
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
};
