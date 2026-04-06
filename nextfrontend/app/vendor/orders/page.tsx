'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import apiService from '@/app/services/apiService';
import { Order } from '@/app/utils/types';


const STATUS_OPTIONS = ['PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
    const [error, setError] = useState('');

    const loadOrders = async () => {
        const response = await apiService.get('/api/vendor/me/orders/');

        if (Array.isArray(response)) {
            setOrders(response);
            setError('');
        } else {
            setError(response.detail || 'Unable to load vendor orders.');
        }

        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const updateStatus = async (orderId: number, status: string) => {
        setUpdatingOrderId(orderId);
        const response = await apiService.patch(
            `/api/vendor/me/orders/${orderId}/status/`,
            JSON.stringify({ status }),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.detail) {
            await loadOrders();
        } else {
            setError(response.detail);
        }

        setUpdatingOrderId(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Vendor Workspace</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Incoming orders</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Track statuses, review order contents, and open a direct customer chat when needed.
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
                            href="/vendor/chats"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Open inbox
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-5">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-64 rounded-[2rem] bg-white animate-pulse" />
                        ))}
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <article key={order.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                            Order #{order.id}
                                        </p>
                                        <h2 className="mt-2 text-2xl font-bold text-slate-900">{order.user.name || 'Customer'}</h2>
                                        <p className="mt-2 text-sm text-slate-600">{order.user.id}</p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {order.address.street_name}, {order.address.city}, {order.address.state}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3 lg:items-end">
                                        <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                                            {order.status}
                                        </span>
                                        <Link
                                            href={`/vendor/chats?customer=${order.user.id}`}
                                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                                        >
                                            Message buyer
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3">
                                    {order.Order_items.map((item) => (
                                        <div key={item.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white p-2">
                                                    <img
                                                        src={item.product.imagelist?.img1 || `https://picsum.photos/seed/vendor-order-${item.id}/240/240`}
                                                        alt={item.product.title}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{item.product.title}</p>
                                                    <p className="mt-1 text-sm text-slate-600">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-bold text-slate-900">${Number(item.total_price).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {STATUS_OPTIONS.map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(order.id, status)}
                                                disabled={updatingOrderId === order.id || order.status === status}
                                                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition ${
                                                    order.status === status
                                                        ? 'bg-slate-900 text-white'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                } disabled:cursor-not-allowed disabled:opacity-60`}
                                            >
                                                {updatingOrderId === order.id && order.status !== status ? 'Updating...' : status}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Order total: <span className="font-bold text-slate-900">${Number(order.total_price).toFixed(2)}</span>
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">No vendor orders yet</h2>
                        <p className="mt-3 text-sm text-slate-600">
                            Orders will appear here when customers purchase from your store.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
