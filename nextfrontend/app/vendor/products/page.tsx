'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import apiService from '@/app/services/apiService';
import { getApiErrorMessage } from '@/app/utils/apiError';
import { Product } from '@/app/utils/types';


export default function VendorProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiService.get('/api/vendor/me/products/');

                if (Array.isArray(response)) {
                    setProducts(response);
                } else {
                    setError(response.detail || 'Unable to load your catalog.');
                }
            } catch (fetchError) {
                setError(getApiErrorMessage(fetchError, 'Unable to load your catalog.'));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Vendor Workspace</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Manage products</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Review inventory, update pricing, and open each product for editing.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/vendor/dashboard"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/vendor/products/new"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Add product
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-72 rounded-3xl bg-white animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/vendor/products/${product.id}`}
                                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="aspect-[4/3] bg-slate-100 p-6">
                                    <img
                                        src={product.imagelist?.img1 || `https://picsum.photos/seed/vendor-product-${product.id}/800/600`}
                                        alt={product.title}
                                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="space-y-4 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                                {product.category?.name || 'Product'}
                                            </p>
                                            <h2 className="mt-2 text-xl font-bold text-slate-900">{product.title}</h2>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {product.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Price</p>
                                            <p className="mt-1 font-bold text-slate-900">${Number(product.discountedPrice).toFixed(2)}</p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stock</p>
                                            <p className="mt-1 font-bold text-slate-900">{product.stock ?? 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                                        <span>Edit product</span>
                                        <span className="transition group-hover:translate-x-1">-&gt;</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Your catalog is empty</h2>
                        <p className="mt-3 text-sm text-slate-600">
                            Add your first product to make your storefront useful.
                        </p>
                        <Link
                            href="/vendor/products/new"
                            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Create first product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
