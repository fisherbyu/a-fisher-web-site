import 'server-only';

/** Error with an intended HTTP status; its message is safe to send to clients */
export class ApiError extends Error {
    /** HTTP status code to respond with */
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}
