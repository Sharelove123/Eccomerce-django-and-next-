'use client'
import { useRouter } from 'next/navigation';
import { handleLogin } from '../lib/actions';
import apiService from '../services/apiService';
import { useState } from 'react';

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const submitLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = {
            email: email,
            password: password
        }

        const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData))

        if (response.access) {
            handleLogin(response.user.pk, response.access, response.refresh);



            router.replace('/');
        } else {
            setErrors(response.non_field_errors);
        }
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" autoComplete={"email"} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    {errors.map((error, index) => {
                        return (
                            <div
                                key={`error_${index}`}
                                className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                            >
                                {error}
                            </div>
                        )
                    })}

                    <div>
                        <button type="submit" onClick={(e) => submitLogin(e)} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={() => { router.push('/signup') }}>Sign Up</a>
                </p>
            </div>
        </div>
    )
}

export default SignIn;
