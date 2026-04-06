'use client';

function buildApiUrl(url: string): string {
    const host = process.env.NEXT_PUBLIC_API_HOST?.trim().replace(/\/$/, '');

    if (!host) {
        throw new Error(`NEXT_PUBLIC_API_HOST is not configured for request: ${url}`);
    }

    return `${host}${url}`;
}

async function requestJson(url: string, init: RequestInit): Promise<any> {
    const requestUrl = buildApiUrl(url);

    try {
        const response = await fetch(requestUrl, {
            ...init,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(init.headers || {}),
            },
        });

        const text = await response.text();
        let payload: any = {};

        if (text) {
            const contentType = response.headers.get('content-type')?.toLowerCase() || '';

            if (contentType.includes('application/json')) {
                payload = JSON.parse(text);
            } else {
                try {
                    payload = JSON.parse(text);
                } catch {
                    payload = {
                        detail: response.ok
                            ? 'The server returned a non-JSON response.'
                            : `Request failed with status ${response.status}.`,
                        status: response.status,
                        raw: text.slice(0, 500),
                    };
                }
            }
        }

        if (!response.ok) {
            throw payload;
        }

        return payload;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(`Network request failed for ${requestUrl}. Check that the backend is running and reachable from the browser.`);
        }

        throw error;
    }
}

const publicApiService = {
    get: async function (url: string): Promise<any> {
        return requestJson(url, {
            method: 'GET',
        });
    },

    post: async function (url: string, data: BodyInit): Promise<any> {
        return requestJson(url, {
            method: 'POST',
            body: data,
        });
    },
};

export default publicApiService;
