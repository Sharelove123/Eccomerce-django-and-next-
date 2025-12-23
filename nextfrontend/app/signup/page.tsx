'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { handleLogin } from '../lib/actions';
import apiService from '../services/apiService';
const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    //
    // Submit functionality

    const submitSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = {
            email: email,
            password1: password1,
            password2: password2
        }

        const response = await apiService.postWithoutToken('/api/auth/register/', JSON.stringify(formData));

        if (response.access) {
            handleLogin(response.user.pk, response.access, response.refresh);

            router.replace('/');
        } else {
            const tmpErrors: string[] = Object.values(response).map((error: any) => {
                return error;
            })
            console.log(tmpErrors);
            setErrors(tmpErrors);
        }
    }


    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign up to your account</h2>
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
                        </div>
                        <div className="mt-2">
                            <input onChange={(e) => setPassword1(e.target.value)} type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password2" className="block text-sm/6 font-medium text-gray-900">Repeat password</label>
                        </div>
                        <div className="mt-2">
                            <input onChange={(e) => setPassword2(e.target.value)} type="password" name="password2" id="password2" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            onClick={(e) => submitSignup(e)} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                    </div>
                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Already have a account?
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={() => { router.push('/signin'); }}>Sign In</a>
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
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp;