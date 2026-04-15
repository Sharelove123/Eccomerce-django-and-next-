'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import apiService from '@/app/services/apiService';
import { Vendor } from '@/app/utils/types';

type VendorProfileFormState = {
    store_name: string;
    store_description: string;
    phone: string;
    address: string;
};

export default function VendorProfilePage() {
    const router = useRouter();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [form, setForm] = useState<VendorProfileFormState>({
        store_name: '',
        store_description: '',
        phone: '',
        address: '',
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [bannerPreview, setBannerPreview] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchVendor = async () => {
            setError('');
            try {
                const response = await apiService.get('/api/vendor/me/');

                if (response?.id) {
                    setVendor(response);
                    setForm({
                        store_name: response.store_name || '',
                        store_description: response.store_description || '',
                        phone: response.phone || '',
                        address: response.address || '',
                    });
                    setLogoPreview(response.store_logo || '');
                    setBannerPreview(response.store_banner || '');
                    return;
                }

                // Fallback: if full profile endpoint fails, at least verify vendor status.
                const status = await apiService.get('/api/vendor/status/');
                if (status?.is_vendor) {
                    setForm((current) => ({
                        ...current,
                        store_name: status.store_name || current.store_name,
                    }));
                    setError('Profile endpoint is temporarily unavailable (500). You can still edit basic fields and try saving.');
                    return;
                }

                router.push('/vendor/register');
            } catch (err: any) {
                const detail = err?.detail || err?.message || 'Failed to load vendor profile.';
                setError(typeof detail === 'string' ? detail : 'Failed to load vendor profile.');
                console.error('[VendorProfilePage] fetchVendor failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [router]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleFileChange = (
        type: 'logo' | 'banner',
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] || null;

        if (type === 'logo') {
            setLogoFile(file);
            setLogoPreview(file ? URL.createObjectURL(file) : logoPreview);
            return;
        }

        setBannerFile(file);
        setBannerPreview(file ? URL.createObjectURL(file) : bannerPreview);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        const payload = new FormData();
        payload.append('store_name', form.store_name);
        payload.append('store_description', form.store_description);
        payload.append('phone', form.phone);
        payload.append('address', form.address);

        if (logoFile) {
            payload.append('store_logo', logoFile);
        }
        if (bannerFile) {
            payload.append('store_banner', bannerFile);
        }

        try {
            const response = await apiService.patch('/api/vendor/me/', payload);

            if (response?.id) {
                setVendor(response);
                setSuccess('Store profile updated.');
            } else {
                setError(response?.detail || 'Unable to update vendor profile.');
            }
        } catch (err: any) {
            const detail = err?.detail || err?.message || 'Unable to update vendor profile.';
            setError(typeof detail === 'string' ? detail : 'Unable to update vendor profile.');
            console.error('[VendorProfilePage] update failed', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-full border-4 border-[rgba(184,131,71,0.16)] border-t-[var(--accent)] animate-spin" />
                    <p className="mt-4 text-sm font-medium text-slate-600">Loading store profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 pb-14 pt-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="eyebrow text-slate-500">Vendor workspace</p>
                        <h1 className="mt-3 text-4xl font-semibold text-slate-950">Store profile</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                            Refine your storefront identity, presentation, and support details from one polished brand workspace.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/vendor/dashboard" className="premium-outline rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em]">
                            Dashboard
                        </Link>
                        {vendor?.slug && (
                            <Link href={`/store/${vendor.slug}`} className="premium-button rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em]">
                                View storefront
                            </Link>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="premium-panel rounded-[2.5rem] p-8 md:p-10">
                        {error && (
                            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        )}

                        <div className="grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700">Store name</label>
                                    <input
                                        type="text"
                                        name="store_name"
                                        value={form.store_name}
                                        onChange={handleChange}
                                        className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Store description</label>
                                <textarea
                                    name="store_description"
                                    value={form.store_description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Address</label>
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows={4}
                                    className="premium-input mt-2 w-full rounded-2xl px-4 py-3 text-slate-900 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="premium-panel rounded-[2.5rem] p-6">
                            <p className="eyebrow text-slate-500">Status</p>
                            <div className="mt-4 rounded-[1.75rem] bg-[rgba(255,252,247,0.88)] p-5 border border-black/10">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Approval</p>
                                <p className={`mt-3 text-2xl font-semibold ${vendor?.is_approved ? 'text-emerald-700' : 'text-amber-700'}`}>
                                    {vendor?.is_approved ? 'Approved and visible' : 'Pending review'}
                                </p>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {vendor?.is_approved
                                        ? 'Your storefront is ready for customers.'
                                        : 'You can continue refining your profile while approval is in progress.'}
                                </p>
                            </div>
                        </div>

                        <div className="premium-panel rounded-[2.5rem] p-6">
                            <p className="eyebrow text-slate-500">Brand assets</p>
                            <div className="mt-5 space-y-5">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-700">Store logo</span>
                                    <div className="mt-2 overflow-hidden rounded-[1.75rem] border border-black/10 bg-[rgba(255,252,247,0.88)]">
                                        <div className="flex h-40 items-center justify-center bg-white">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Store logo preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <p className="text-sm text-slate-400">Upload a square logo</p>
                                            )}
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" id="vendor-logo-input" onChange={(event) => handleFileChange('logo', event)} />
                                        <label htmlFor="vendor-logo-input" className="block cursor-pointer border-t border-black/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">
                                            {logoPreview ? 'Replace logo' : 'Upload logo'}
                                        </label>
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-700">Store banner</span>
                                    <div className="mt-2 overflow-hidden rounded-[1.75rem] border border-black/10 bg-[rgba(255,252,247,0.88)]">
                                        <div className="flex h-40 items-center justify-center bg-white">
                                            {bannerPreview ? (
                                                <img src={bannerPreview} alt="Store banner preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <p className="text-sm text-slate-400">Upload a wide storefront banner</p>
                                            )}
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" id="vendor-banner-input" onChange={(event) => handleFileChange('banner', event)} />
                                        <label htmlFor="vendor-banner-input" className="block cursor-pointer border-t border-black/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">
                                            {bannerPreview ? 'Replace banner' : 'Upload banner'}
                                        </label>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="premium-button w-full rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? 'Saving profile...' : 'Save store profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
