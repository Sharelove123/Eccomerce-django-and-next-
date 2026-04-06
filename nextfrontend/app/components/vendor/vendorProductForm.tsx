'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import apiService from '@/app/services/apiService';
import { getApiErrorMessage } from '@/app/utils/apiError';
import { Product } from '@/app/utils/types';


type VendorProductFormProps = {
    mode: 'create' | 'edit';
    productId?: string;
};

type ProductFormState = {
    title: string;
    category: string;
    discription: string;
    orginalPrice: string;
    discountedPrice: string;
    stock: string;
    is_active: boolean;
};

const emptyForm: ProductFormState = {
    title: '',
    category: '',
    discription: '',
    orginalPrice: '',
    discountedPrice: '',
    stock: '0',
    is_active: true,
};

export default function VendorProductForm({ mode, productId }: VendorProductFormProps) {
    const router = useRouter();
    const [form, setForm] = useState<ProductFormState>(emptyForm);
    const [loading, setLoading] = useState(mode === 'edit');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [imageFiles, setImageFiles] = useState<Array<File | null>>([null, null, null, null]);
    const [imagePreviews, setImagePreviews] = useState<Array<string | null>>([null, null, null, null]);

    useEffect(() => {
        if (mode !== 'edit') {
            return;
        }

        if (!productId) {
            setError('Unable to determine which product to edit.');
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const response: Product | { detail?: string } = await apiService.get(`/api/vendor/me/products/${productId}/`);

                if (!('id' in response)) {
                    setError(response.detail || 'Unable to load product details.');
                    return;
                }

                setForm({
                    title: response.title || '',
                    category: response.category?.name || '',
                    discription: response.discription || '',
                    orginalPrice: String(response.orginalPrice ?? ''),
                    discountedPrice: String(response.discountedPrice ?? ''),
                    stock: String(response.stock ?? 0),
                    is_active: response.is_active ?? true,
                });
                setImagePreviews([
                    response.imagelist?.img1 || null,
                    response.imagelist?.img2 || null,
                    response.imagelist?.img3 || null,
                    response.imagelist?.img4 || null,
                ]);
            } catch (fetchError) {
                setError(getApiErrorMessage(fetchError, 'Unable to load product details.'));
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [mode, productId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
        }));
    };

    const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        setImageFiles((current) => {
            const next = [...current];
            next[index] = file;
            return next;
        });

        setImagePreviews((current) => {
            const next = [...current];
            next[index] = file ? URL.createObjectURL(file) : next[index];
            return next;
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = new FormData();
            payload.append('title', form.title);
            payload.append('category', form.category);
            payload.append('discription', form.discription);
            payload.append('orginalPrice', form.orginalPrice);
            payload.append('discountedPrice', form.discountedPrice || form.orginalPrice);
            payload.append('stock', form.stock);
            payload.append('is_active', String(form.is_active));

            imageFiles.forEach((file, index) => {
                if (file) {
                    payload.append(`img${index + 1}`, file);
                }
            });

            const endpoint = mode === 'create'
                ? '/api/vendor/me/products/'
                : `/api/vendor/me/products/${productId}/`;

            const response = mode === 'create'
                ? await apiService.post(endpoint, payload)
                : await apiService.patch(endpoint, payload);

            if (response.id) {
                router.push('/vendor/products');
                router.refresh();
                return;
            }

            setError(response.detail || 'Unable to save this product.');
        } catch (submitError) {
            setError(getApiErrorMessage(submitError, 'Unable to save this product.'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
                    <p className="mt-4 text-sm font-medium text-slate-600">Loading product editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Vendor Workspace</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            {mode === 'create' ? 'Add a new product' : 'Edit product'}
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Manage pricing, inventory, and gallery assets for your catalog.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/vendor/products"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                        >
                            Back to products
                        </Link>
                        <Link
                            href="/vendor/dashboard"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        {error && (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Product title</span>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={form.title}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Category</span>
                                <input
                                    type="text"
                                    name="category"
                                    required
                                    value={form.category}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                                />
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-sm font-semibold text-slate-700">Description</span>
                            <textarea
                                name="discription"
                                value={form.discription}
                                onChange={handleChange}
                                rows={6}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>

                        <div className="grid gap-6 md:grid-cols-3">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Original price</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="orginalPrice"
                                    required
                                    value={form.orginalPrice}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Discounted price</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="discountedPrice"
                                    value={form.discountedPrice}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Stock</span>
                                <input
                                    type="number"
                                    min="0"
                                    name="stock"
                                    required
                                    value={form.stock}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">Status</h2>
                            <label className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="text-sm font-medium text-slate-700">Product visible in storefront</span>
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                            </label>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-slate-900">Gallery</h2>
                                <p className="mt-1 text-sm text-slate-600">Upload up to four product images.</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {imagePreviews.map((preview, index) => (
                                    <label
                                        key={index}
                                        className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400"
                                    >
                                        <div className="flex aspect-square items-center justify-center bg-white">
                                            {preview ? (
                                                <img src={preview} alt={`Product preview ${index + 1}`} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="text-center text-sm text-slate-400">
                                                    <p className="font-semibold">Image {index + 1}</p>
                                                    <p>Click to upload</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => handleImageChange(index, event)}
                                        />
                                        <span className="border-t border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700">
                                            {preview ? 'Replace image' : 'Upload image'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? 'Saving product...' : mode === 'create' ? 'Create product' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
