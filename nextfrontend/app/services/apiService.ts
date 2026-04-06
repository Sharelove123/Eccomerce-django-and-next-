// filepath: /c:/Users/rachit/Desktop/djangonextproj/eccomerce/nextfrontend/app/services/apiService.ts
console.log('API Host:', process.env.NEXT_PUBLIC_API_HOST);

import { getAccessToken } from "../lib/actions";

function buildApiUrl(url: string): string {
    const host = process.env.NEXT_PUBLIC_API_HOST?.trim().replace(/\/$/, '');

    if (!host) {
        throw new Error(`NEXT_PUBLIC_API_HOST is not configured for request: ${url}`);
    }

    return `${host}${url}`;
}

async function parseJsonResponse(response: Response): Promise<any> {
    const text = await response.text();

    if (!text) {
        return {};
    }

    const contentType = response.headers.get('content-type')?.toLowerCase() || '';

    if (contentType.includes('application/json')) {
        return JSON.parse(text);
    }

    try {
        return JSON.parse(text);
    } catch {
        return {
            detail: response.ok
                ? 'The server returned a non-JSON response.'
                : `Request failed with status ${response.status}.`,
            status: response.status,
            raw: text.slice(0, 500),
        };
    }
}

async function requestJson(url: string, init: RequestInit): Promise<any> {
    const requestUrl = buildApiUrl(url);

    try {
        const response = await fetch(requestUrl, init);
        const payload = await parseJsonResponse(response);

        if (!response.ok) {
            throw payload;
        }

        console.log('Response:', payload);
        return payload;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(`Network request failed for ${requestUrl}. Check that the backend is running and reachable from the browser.`);
        }

        throw error;
    }
}

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);

        const token = await getAccessToken();

        return requestJson(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    },

    post: async function (url: string, data: any, config: { headers?: Record<string, string> } = {}): Promise<any> {
        console.log('post', url, data);
        const token = await getAccessToken();

        return requestJson(url, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...(config.headers || {})
            }
        })
    },

    patch: async function (url: string, data: any, config: { headers?: Record<string, string> } = {}): Promise<any> {
        console.log('patch', url, data);
        const token = await getAccessToken();

        return requestJson(url, {
            method: 'PATCH',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...(config.headers || {})
            }
        })
    },

    delete: async function (url: string): Promise<any> {
        console.log('delete', url);

        const token = await getAccessToken();

        return requestJson(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },

    postWithoutToken: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);

        return requestJson(url, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    },

    getWithoutToken: async function (url: string): Promise<any> {
        console.log('get', url);


        return requestJson(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
    },

}

export default apiService;
