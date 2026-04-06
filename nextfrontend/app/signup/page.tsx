'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { handleLogin } from '../lib/actions';
import publicApiService from '../services/publicApiService';

const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const submitSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrors([]);
        setLoading(true);

        if (password1 !== password2) {
            setErrors(['Passwords do not match']);
            setLoading(false);
            return;
        }

        try {
            const formData = {
                email,
                password1,
                password2,
            };

            const response = await publicApiService.post('/api/auth/register/', JSON.stringify(formData));

            if (response.access) {
                const userId = response.user?.pk || response.user?.id;

                if (!userId) {
                    setErrors(['Registration succeeded but no user id was returned.']);
                    setLoading(false);
                    return;
                }

                await handleLogin(userId, response.access, response.refresh);
                router.replace('/');
                router.refresh();
            } else {
                const tmpErrors: string[] = Object.entries(response).map(([key, val]) => {
                    if (Array.isArray(val)) {
                        return `${key}: ${val.join(', ')}`;
                    }

                    return `${key}: ${val}`;
                });

                setErrors(tmpErrors.length > 0 ? tmpErrors : ['Registration failed. Please try again.']);
            }
        } catch (error) {
            const tmpErrors = Array.isArray((error as { non_field_errors?: string[] }).non_field_errors)
                ? (error as { non_field_errors: string[] }).non_field_errors
                : Object.entries((error as Record<string, unknown>) || {}).map(([key, val]) => {
                    if (Array.isArray(val)) {
                        return `${key}: ${val.join(', ')}`;
                    }

                    return `${key}: ${String(val)}`;
                });

            setErrors(tmpErrors.length > 0 ? tmpErrors : ['Network error. The server may be starting up - please try again in a moment.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-12 lg:px-8">
            <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[rgba(184,131,71,0.16)] blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[rgba(99,124,147,0.14)] blur-[100px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
                <div className="text-center mb-10">
                    <span className="text-3xl font-semibold tracking-[0.2em] gold-accent">
                        ECCOMERCE
                    </span>
                    <h2 className="mt-6 text-center text-4xl font-semibold leading-tight text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">Create a customer account and move through checkout, orders, and chats with ease.</p>
                </div>

                <div className="premium-panel rounded-[2rem] p-8">
                    <form className="space-y-6" onSubmit={submitSignup}>
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
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">Password</label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => setPassword1(e.target.value)}
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="new-password"
                                    required
                                    placeholder="********"
                                    className="premium-input block w-full rounded-2xl py-3 px-4 text-black placeholder:text-slate-400 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password2" className="block text-sm font-medium leading-6 text-foreground">Repeat password</label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => setPassword2(e.target.value)}
                                    type="password"
                                    name="password2"
                                    id="password2"
                                    autoComplete="new-password"
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
                                {loading ? 'Signing up...' : 'Sign up'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/signin" className="font-semibold leading-6 text-primary hover:text-primary/80 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
