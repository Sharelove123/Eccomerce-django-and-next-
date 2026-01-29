'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { handleLogin } from '../lib/actions';
import apiService from '../services/apiService';
import Link from 'next/link';

const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const submitSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        if (password1 !== password2) {
            setErrors(["Passwords do not match"]);
            setLoading(false);
            return;
        }

        const formData = {
            email: email,
            password1: password1,
            password2: password2
        }

        const response = await apiService.postWithoutToken('/api/auth/register/', JSON.stringify(formData));
        setLoading(false);

        if (response.access) {
            handleLogin(response.user.pk, response.access, response.refresh);
            router.replace('/');
        } else {
            const tmpErrors: string[] = Object.values(response).map((error: any) => {
                return error;
            });
            setErrors(tmpErrors.length > 0 ? tmpErrors : ["Registration failed."]);
        }
    }

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-background relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
                <div className="text-center mb-10">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ECCOMERCE
                    </span>
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">Join us and start shopping</p>
                </div>

                <div className="bg-card/50 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-8">
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
                                    className="block w-full rounded-lg border-0 bg-muted/50 py-2.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
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
                                    className="block w-full rounded-lg border-0 bg-muted/50 py-2.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
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
                                    className="block w-full rounded-lg border-0 bg-muted/50 py-2.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                                />
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {errors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-lg shadow-primary/25 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing up..." : "Sign up"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <button onClick={() => router.push('/signin')} className="font-semibold leading-6 text-primary hover:text-primary/80 transition-colors">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp;