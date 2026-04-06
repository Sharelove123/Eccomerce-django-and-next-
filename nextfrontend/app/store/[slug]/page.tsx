'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import ProductCard from '@/app/components/ProductCard';
import apiService from '@/app/services/apiService';
import { PaginatedResponse, Product, Vendor } from '@/app/utils/types';


export default function StorefrontPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) {
            return;
        }

        const fetchStorefront = async () => {
            const vendorResponse = await apiService.getWithoutToken(`/api/vendor/store/${slug}/`);
            const productsResponse: PaginatedResponse<Product> | Product[] = await apiService.getWithoutToken(`/api/vendor/store/${slug}/products/`);

            if (vendorResponse.id) {
                setVendor(vendorResponse);
            } else {
                setError(vendorResponse.detail || 'Unable to load storefront.');
            }

            if (Array.isArray(productsResponse)) {
                setProducts(productsResponse);
            } else {
                setProducts(productsResponse.results || []);
            }

            setLoading(false);
        };

        fetchStorefront();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
                    <p className="mt-4 text-sm font-medium text-slate-600">Loading storefront...</p>
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-lg rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-12 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">Store not found</h1>
                    <p className="mt-3 text-sm text-slate-600">{error || 'This vendor storefront is unavailable.'}</p>
                    <Link href="/" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                        Return home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900 px-4 py-20 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.2),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(96,165,250,0.18),_transparent_30%)]" />
                <div className="relative mx-auto max-w-6xl">
                    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">Vendor Storefront</p>
                            <h1 className="mt-4 text-4xl font-bold md:text-6xl">{vendor.store_name}</h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                                {vendor.store_description || 'This vendor has not added a storefront description yet.'}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={`/messages?vendor=${vendor.id}`}
                                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                                >
                                    Chat with vendor
                                </Link>
                                <Link
                                    href="/categories/?name=All"
                                    className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                                >
                                    Continue browsing
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[2rem] border border-white/10 bg-white/5 px-5 py-6 backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Products</p>
                                <p className="mt-3 text-3xl font-bold">{vendor.product_count || 0}</p>
                            </div>
                            <div className="rounded-[2rem] border border-white/10 bg-white/5 px-5 py-6 backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Rating</p>
                                <p className="mt-3 text-3xl font-bold">{vendor.average_rating || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Catalog</p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900">Products from {vendor.store_name}</h2>
                        </div>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <h3 className="text-2xl font-bold text-slate-900">No products live yet</h3>
                            <p className="mt-3 text-sm text-slate-600">
                                Check back later for this vendor&apos;s latest listings.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
