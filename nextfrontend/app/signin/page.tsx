'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { handleLogin } from '../lib/actions';
import publicApiService from '../services/publicApiService';

function getLoginErrors(payload: unknown): string[] {
    if (!payload || typeof payload !== 'object') {
        return [];
    }

    const data = payload as Record<string, unknown>;

    if (Array.isArray(data.non_field_errors)) {
        return data.non_field_errors.map((item) => String(item));
    }

    if (typeof data.detail === 'string') {
        return [data.detail];
    }

    if (typeof data.message === 'string') {
        return [data.message];
    }

    const fieldErrors = Object.entries(data)
        .filter(([key]) => !['status', 'raw'].includes(key))
        .map(([key, val]) => {
            if (Array.isArray(val)) {
                return `${key}: ${val.join(', ')}`;
            }

            return `${key}: ${String(val)}`;
        });

    if (fieldErrors.length > 0) {
        return fieldErrors;
    }

    if (typeof data.raw === 'string' && data.raw.trim()) {
        return [data.raw];
    }

    return [];
}

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const submitLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            const formData = {
                email,
                password,
            };

            const response = await publicApiService.post('/api/auth/login/', JSON.stringify(formData));

            if (response.access) {
                const userId = response.user?.pk || response.user?.id;

                if (!userId) {
                    setErrors(['Login succeeded but no user id was returned.']);
                    setLoading(false);
                    return;
                }

                await handleLogin(userId, response.access, response.refresh);
                router.replace('/');
                router.refresh();
            } else {
                const msgs = getLoginErrors(response);

                setErrors(msgs.length > 0 ? msgs : ['Login failed. Please check your credentials.']);
            }
        } catch (error) {
            const msgs = getLoginErrors(error);

            setErrors(msgs.length > 0 ? msgs : ['Network error. The server may be starting up - please try again in a moment.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-12 lg:px-8">
            <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[rgba(184,131,71,0.16)] blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[rgba(99,124,147,0.14)] blur-[100px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
                <div className="text-center mb-10">
                    <span className="text-3xl font-semibold tracking-[0.2em] gold-accent">
                        ECCOMERCE
                    </span>
                    <h2 className="mt-6 text-center text-4xl font-semibold leading-tight text-foreground">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">Sign in to continue your orders, chats, and vendor workspace.</p>
                </div>

                <div className="premium-panel rounded-[2rem] p-8">
                    <form className="space-y-6" onSubmit={submitLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">Email address</label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    required
                                    placeholder="you@example.com"
                                    className="premium-input block w-full rounded-2xl py-3 px-4 text-black placeholder:text-slate-400 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">Password</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="********"
                                    className="premium-input block w-full rounded-2xl py-3 px-4 text-black placeholder:text-slate-400 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {errors.map((errorMessage, index) => (
                                    <p key={index}>{errorMessage}</p>
                                ))}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="premium-button flex w-full justify-center rounded-full px-4 py-3 text-sm font-semibold leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-muted-foreground">
                        Not a member?{' '}
                        <Link href="/signup" className="font-semibold leading-6 text-primary hover:text-primary/80 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
