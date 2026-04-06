'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/app/services/apiService';
import { VendorDashboard } from '@/app/utils/types';
import Link from 'next/link';
import {
    TrendingUp, Inventory, ShoppingCart, Star,
    Add, Storefront, Edit, ArrowForward,
    HourglassTop, Forum,
} from '@mui/icons-material';

export default function VendorDashboardPage() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<VendorDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await apiService.get('/api/vendor/me/dashboard/');
                if (response.id) {
                    setDashboard(response);
                } else {
                    router.push('/vendor/register');
                }
            } catch {
                router.push('/vendor/register');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full border-4 border-[rgba(184,131,71,0.16)] border-t-[var(--accent)] animate-spin" />
                    <p className="mt-4 text-sm font-medium text-slate-600">Loading vendor dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dashboard) return null;

    const stats = [
        {
            label: 'Total Revenue',
            value: `$${Number(dashboard.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: <TrendingUp />,
            tone: 'bg-[rgba(104,130,84,0.12)] text-emerald-700',
        },
        {
            label: 'Total Sales',
            value: dashboard.total_sales_count || 0,
            icon: <ShoppingCart />,
            tone: 'bg-[rgba(91,134,174,0.12)] text-sky-700',
        },
        {
            label: 'Active Products',
            value: dashboard.product_count || 0,
            icon: <Inventory />,
            tone: 'bg-[rgba(125,96,176,0.12)] text-violet-700',
        },
        {
            label: 'Avg. Rating',
            value: dashboard.average_rating ? `${dashboard.average_rating} stars` : 'N/A',
            icon: <Star />,
            tone: 'bg-[rgba(184,131,71,0.14)] text-[var(--secondary)]',
        },
    ];

    const quickActions = [
        {
            href: '/vendor/products',
            label: 'Manage products',
            icon: <Inventory fontSize="small" />,
            enabled: dashboard.is_approved,
        },
        {
            href: '/vendor/orders',
            label: 'View orders',
            icon: <ShoppingCart fontSize="small" />,
            enabled: true,
        },
        {
            href: '/vendor/profile',
            label: 'Edit profile',
            icon: <Edit fontSize="small" />,
            enabled: true,
        },
        {
            href: '/vendor/chats',
            label: 'Customer chats',
            icon: <Forum fontSize="small" />,
            enabled: true,
        },
    ];

    return (
        <div className="px-4 pb-14 pt-8">
            <div className="mx-auto max-w-7xl">
                <section className="premium-dark-panel overflow-hidden rounded-[2.75rem] px-8 py-10 text-white md:px-10 md:py-12">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="eyebrow text-white/45">Vendor dashboard</p>
                            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">{dashboard.store_name}</h1>
                            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/72">
                                Track performance, manage your catalog, respond to customers, and keep your storefront operating with clarity.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {dashboard.is_approved ? (
                                <Link href="/vendor/products/new" className="premium-button rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em]">
                                    <span className="inline-flex items-center gap-2"><Add fontSize="small" /> Add product</span>
                                </Link>
                            ) : (
                                <span className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
                                    <span className="inline-flex items-center gap-2"><HourglassTop fontSize="small" /> Approval pending</span>
                                </span>
                            )}
                            <Link href={`/store/${dashboard.slug}`} className="premium-outline rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em]">
                                <span className="inline-flex items-center gap-2"><Storefront fontSize="small" /> View store</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {!dashboard.is_approved && (
                    <div className="mt-6 rounded-[2rem] border border-amber-200 bg-[linear-gradient(180deg,#fff7e7,#fffaf1)] p-5 text-amber-900 shadow-[0_18px_40px_rgba(184,131,71,0.08)]">
                        <div className="flex items-start gap-3">
                            <HourglassTop className="mt-0.5 text-amber-700" />
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.16em]">Review in progress</p>
                                <p className="mt-2 text-sm leading-7 text-amber-800">
                                    Your vendor account is being reviewed. You can still refine your profile and catalog while approval is pending.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="premium-panel rounded-[2rem] p-6">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
                                {stat.icon}
                            </div>
                            <p className="mt-5 text-3xl font-semibold text-slate-950">{stat.value}</p>
                            <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <section className="premium-panel rounded-[2.5rem] p-6">
                        <p className="eyebrow text-slate-500">Quick actions</p>
                        <div className="mt-5 grid gap-3">
                            {quickActions.map((action) => (
                                action.enabled ? (
                                    <Link key={action.label} href={action.href} className="flex items-center justify-between rounded-[1.5rem] border border-black/10 bg-[rgba(255,252,247,0.9)] px-5 py-4 text-slate-900 hover:bg-white">
                                        <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em]">
                                            {action.icon}
                                            {action.label}
                                        </span>
                                        <ArrowForward fontSize="small" />
                                    </Link>
                                ) : (
                                    <div key={action.label} className="flex items-center justify-between rounded-[1.5rem] border border-black/8 bg-[rgba(0,0,0,0.03)] px-5 py-4 text-slate-400">
                                        <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em]">
                                            {action.icon}
                                            {action.label}
                                        </span>
                                        <HourglassTop fontSize="small" />
                                    </div>
                                )
                            ))}
                        </div>
                    </section>

                    <section className="premium-panel rounded-[2.5rem] p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="eyebrow text-slate-500">Recent orders</p>
                                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Latest order activity</h2>
                            </div>
                            <Link href="/vendor/orders" className="premium-outline rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]">
                                View all
                            </Link>
                        </div>

                        {dashboard.recent_orders && dashboard.recent_orders.length > 0 ? (
                            <div className="mt-6 space-y-3">
                                {dashboard.recent_orders.slice(0, 5).map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-black/10 bg-[rgba(255,252,247,0.9)] p-4">
                                        <div className="flex items-center gap-4">
                                            {item.product?.imagelist?.img1 ? (
                                                <img src={item.product.imagelist.img1} alt="" className="h-14 w-14 rounded-2xl object-contain bg-white p-1" />
                                            ) : (
                                                <div className="h-14 w-14 rounded-2xl bg-[rgba(0,0,0,0.05)]" />
                                            )}
                                            <div>
                                                <p className="text-base font-semibold text-slate-950">{item.product?.title}</p>
                                                <p className="mt-1 text-sm text-slate-600">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-base font-semibold text-slate-950">${item.total_price}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-[1.75rem] border border-dashed border-black/12 bg-[rgba(255,252,247,0.84)] px-6 py-12 text-center">
                                <p className="text-xl font-semibold text-slate-950">No orders yet</p>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    Orders will appear here once customers start buying from your store.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
