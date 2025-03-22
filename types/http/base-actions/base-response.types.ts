import { HttpMethod } from '@/types';

/**
 * Base HTTP Response
 */
export interface BaseResponse<T> {
    success: boolean;
    data: T;
    error?: ErrorResponse;
}

interface ErrorResponse {
    code: typeof HttpMethod;
    message: string;
}
