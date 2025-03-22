import { BaseResponse, HttpMethod, RequestOptions } from '@/types';

/**
 * Makes HTTP request to the specified endpoint
 * @template TRequest - Type of the request body
 * @template TResponse - Type of the response data
 * @param method: HTTTP Method [GET | POST | PUT | PATCH | OPTIONS]
 * @param endpoint Target API Endpoint
 * @param options Request Options { body?: TRequest; queryString?: string; }
 * @returns {Promise<TResponse>} The response data
 */
export const makeRequest = async <TRequest, TResponse, TModel>(
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions<TRequest>
): Promise<TModel> => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseURL}${endpoint}${options?.queryString || ''}`;
    try {
        const response = await fetch(url, {
            method,
            credentials: 'include',
            body: options?.body ? JSON.stringify(options.body) : undefined,
        });
        const { data, success, error } = (await response.json()) as BaseResponse<TResponse>;
        if (!success) throw new Error(`Failed to fetch data for ${endpoint}: ${error?.message}`);

        return data as unknown as TModel;
    } catch (error) {
        console.error(error);
        // TODO: Create a user friendly way to display errors (toasts?)
        throw error; // this is done to trigger the useSWR error boundary
    }
};
