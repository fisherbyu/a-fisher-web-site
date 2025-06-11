/**
 * Makes GET request to the specified endpoint
 * @template T - Type of the response data
 * @param endpoint Target API endpoint
 * @param queryParams Optional query parameters
 * @returns Promise resolving to response data
 */
export const makeRequest = async <T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    const url = new URL(endpoint, baseURL);

    // Add query parameters
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
};
