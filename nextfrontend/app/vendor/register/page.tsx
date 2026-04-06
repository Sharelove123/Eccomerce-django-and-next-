'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/app/services/apiService';
import { Storefront, CloudUpload, CheckCircle } from '@mui/icons-material';

export default function VendorRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        store_name: '',
        store_description: '',
        phone: '',
        address: '',
    });
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('store_name', formData.store_name);
            data.append('store_description', formData.store_description);
            data.append('phone', formData.phone);
            data.append('address', formData.address);
            if (logo) {
                data.append('store_logo', logo);
            }

            const response = await apiService.post('/api/vendor/register/', data);

            if (response.status === 'success') {
                setSuccess(true);
            } else {
                setError(response.detail || response.store_name?.[0] || 'Registration failed. Please try again.');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="px-4 pb-14 pt-8">
                <div className="mx-auto max-w-3xl premium-panel rounded-[2.5rem] p-10 text-center md:p-14">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(104,130,84,0.12)] text-emerald-700">
                        <CheckCircle style={{ fontSize: 48 }} />
                    </div>
                    <p className="eyebrow mt-8 text-slate-500">Application sent</p>
                    <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-5xl">Your seller application is in review.</h1>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-600">
                        Your storefront details have been submitted. Once approved, you can start listing products and reply to customers from your dashboard.
                    </p>
                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => router.push('/vendor/dashboard')}
                            className="premium-button rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]"
                        >
                            Go to dashboard
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="premium-outline rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]"
                        >
                            Return home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 pb-14 pt-8">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                    <section className="premium-dark-panel rounded-[2.5rem] p-8 text-white md:p-10">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/10">
                            <Storefront style={{ fontSize: 32 }} />
                        </div>
                        <p className="eyebrow mt-8 text-white/45">Seller onboarding</p>
                        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                            Launch a store that feels as refined as the products you sell.
                        </h1>
                        <p className="mt-5 text-sm leading-8 text-white/70">
                            Create your storefront identity, upload your brand mark, and prepare your workspace for product listings, customer chats, and order management.
                        </p>
                        <div className="mt-10 space-y-4">
                            {[
                                'Set your storefront name and contact details',
                                'Upload a recognizable logo for buyers',
                                'Move into the vendor dashboard after review',
                            ].map((item) => (
                                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <form onSubmit={handleSubmit} className="premium-panel rounded-[2.5rem] p-8 md:p-10">
                        {error && (
                            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Store name</label>
                                <input
                                    type="text"
                                    name="store_name"
                                    value={formData.store_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Atelier Modern"
                                    className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Store logo</label>
                                <div className="mt-2 flex items-center gap-5 rounded-[1.75rem] border border-black/10 bg-[rgba(255,252,247,0.88)] p-5">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo preview" className="h-20 w-20 rounded-[1.25rem] object-cover" />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-[rgba(184,131,71,0.12)] text-[var(--secondary)]">
                                            <CloudUpload />
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="premium-outline rounded-full px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em]">
                                            {logoPreview ? 'Replace logo' : 'Upload logo'}
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Store description</label>
                                <textarea
                                    name="store_description"
                                    value={formData.store_description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Describe the style, products, and promise behind your store."
                                    className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900 resize-none"
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 123-4567"
                                        className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700">Business address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Studio, city, region"
                                        className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="premium-button mt-2 w-full rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Submitting application...' : 'Submit seller application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
