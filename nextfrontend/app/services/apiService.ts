// filepath: /c:/Users/rachit/Desktop/djangonextproj/eccomerce/nextfrontend/app/services/apiService.ts
console.log('API Host:', process.env.NEXT_PUBLIC_API_HOST);

import { patch } from "@mui/material";
import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    post: async function (url: string, data: any, p0: { headers: { 'Content-Type': string; }; }): Promise<any> {
        console.log('post', url, data);
        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    patch: async function (url: string, data: any, p0: { headers: { 'Content-Type': string; }; }): Promise<any> {
        console.log('post', url, data);
        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    delete: async function (url: string): Promise<any> {
        console.log('delete', url);

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(async response => {
                    if (!response.ok) {
                        const err = await response.json();
                        throw err;
                    }
                    // Handle cases where the response body is empty
                    const text = await response.text();
                    return text ? JSON.parse(text) : {};
                })
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    postWithoutToken: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    getWithoutToken: async function (url: string): Promise<any> {
        console.log('get', url);


        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

}

export default apiService;