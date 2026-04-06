export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null) {
        if ('detail' in error && typeof error.detail === 'string') {
            return error.detail;
        }

        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
    }

    return fallback;
}
