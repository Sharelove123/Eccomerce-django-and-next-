'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ReceiptLong,
    ShoppingBag,
    Forum,
    Storefront,
    Logout,
    Edit,
    Close,
    FileUpload,
} from '@mui/icons-material';


import { handleLogout } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import { VendorStatus } from '@/app/utils/types';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ id?: string, name: string; email: string; avatar_url?: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAvatar, setEditAvatar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    const submitProfileUpdate = async () => {
        setEditLoading(true);
        setEditError('');
        try {
            const formData = new FormData();
            formData.append('name', editName);
            if (editAvatar) {
                formData.append('avatar', editAvatar);
            }

            const data = await apiService.post('/api/auth/profile/update/', formData);

            if (data.success) {
                setUser((currentUser) => currentUser ? { ...currentUser, ...data.user } : data.user);
                setEditName(data.user?.name || '');
                setEditAvatar(null);
                setPreviewUrl(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setEditError(error.message);
            } else if (error && typeof error === 'object' && 'detail' in error && typeof error.detail === 'string') {
                setEditError(error.detail);
            } else {
                setEditError('Unable to update your profile right now.');
            }
        } finally {
            setEditLoading(false);
        }
    };
    const [vendorStatus, setVendorStatus] = useState<VendorStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userResponse = await apiService.get('/api/auth/user/');

                if (!userResponse || userResponse.error) {
                    router.push('/signin');
                    return;
                }

                setUser(userResponse);
                setEditName(userResponse.name || '');

                const vendorResponse = await apiService.get('/api/vendor/status/');
                if (vendorResponse && typeof vendorResponse.is_vendor === 'boolean') {
                    setVendorStatus(vendorResponse);
                }
            } catch {
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const onLogout = async () => {
        await handleLogout();
        router.push('/signin');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-full border-4 border-[rgba(184,131,71,0.16)] border-t-[var(--accent)] animate-spin" />
                    <p className="mt-4 text-sm font-medium text-slate-600">Loading account...</p>
                </div>
            </div>
        );
    }

    const actionCards = [
        {
            href: '/orderList',
            title: 'Orders',
            description: 'Review recent purchases and track delivery progress.',
            icon: <ReceiptLong fontSize="small" />,
            tone: 'bg-[rgba(91,134,174,0.12)] text-sky-700',
        },
        {
            href: '/cart',
            title: 'Cart',
            description: 'Return to saved selections and continue checkout.',
            icon: <ShoppingBag fontSize="small" />,
            tone: 'bg-[rgba(104,130,84,0.12)] text-emerald-700',
        },
        {
            href: vendorStatus?.is_vendor ? '/vendor/chats' : '/messages',
            title: vendorStatus?.is_vendor ? 'Vendor Chats' : 'Messages',
            description: vendorStatus?.is_vendor
                ? 'Reply to customer conversations from your storefront.'
                : 'Talk to sellers about products and support.',
            icon: <Forum fontSize="small" />,
            tone: 'bg-[rgba(125,96,176,0.12)] text-violet-700',
        },
        {
            href: vendorStatus?.is_vendor ? '/vendor/dashboard' : '/vendor/register',
            title: vendorStatus?.is_vendor ? 'Vendor Dashboard' : 'Become a Seller',
            description: vendorStatus?.is_vendor
                ? 'Manage store performance, products, orders, and profile.'
                : 'Open your own storefront and start selling.',
            icon: <Storefront fontSize="small" />,
            tone: 'bg-[rgba(184,131,71,0.14)] text-[var(--secondary)]',
        },
    ];

    return (
        <div className="px-4 pb-14 pt-8">
            <div className="mx-auto max-w-6xl">
                <section className="premium-panel overflow-hidden rounded-[2.5rem]">
                    <div className="relative border-b border-black/10 bg-[linear-gradient(135deg,rgba(20,26,34,0.96),rgba(85,61,33,0.76))] px-8 py-10 text-white md:px-12 md:py-14">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(214,189,153,0.22),transparent_34%)]" />
                        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                            <div className="flex items-center gap-5">
                                <div className="flex h-24 w-24 overflow-hidden items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 text-4xl font-semibold text-white">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        (user?.name || user?.email || 'U').slice(0, 1).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="eyebrow text-white/60">Account</p>
                                    <div className="flex items-center gap-3">
                                        <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">
                                            {user?.name || 'Welcome back'}
                                        </h1>
                                        <button onClick={() => setIsEditing(true)} className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                                            <Edit fontSize="small" />
                                        </button>
                                    </div>
                                    <p className="mt-3 text-sm text-white/70">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                                    {vendorStatus?.is_vendor
                                        ? (vendorStatus.is_approved ? 'Seller approved' : 'Seller pending')
                                        : 'Customer account'}
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15"
                                >
                                    <Logout fontSize="small" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 px-8 py-8 md:px-12 md:py-10 lg:grid-cols-[0.85fr_1.15fr]">
                        <div className="space-y-5">
                            <div className="rounded-[2rem] border border-black/10 bg-[rgba(255,252,247,0.9)] p-6">
                                <p className="eyebrow text-slate-500">Overview</p>
                                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Your account at a glance.</h2>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    Move between purchases, conversations, and storefront tools from one calm, structured account hub.
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-black/10 bg-[rgba(22,28,36,0.98)] p-6 text-white">
                                <p className="eyebrow text-white/45">Status</p>
                                <p className="mt-3 text-2xl font-semibold">
                                    {vendorStatus?.is_vendor
                                        ? (vendorStatus.is_approved ? 'Your store is live.' : 'Your store is under review.')
                                        : 'You are shopping as a customer.'}
                                </p>
                                <p className="mt-3 text-sm leading-7 text-white/68">
                                    {vendorStatus?.is_vendor
                                        ? 'Use the dashboard to manage products, orders, and direct customer chats.'
                                        : 'Switch to seller mode whenever you are ready to open a storefront.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {actionCards.map((card) => (
                                <Link
                                    key={card.title}
                                    href={card.href}
                                    className="premium-panel rounded-[2rem] p-5 hover:-translate-y-1"
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}>
                                        {card.icon}
                                    </div>
                                    <h3 className="mt-5 text-2xl font-semibold text-slate-950">{card.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Open section
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-slate-900">Edit Profile</h2>
                            <button onClick={() => setIsEditing(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                <Close />
                            </button>
                        </div>
                        
                        <div className="mt-6 flex flex-col items-center gap-4">
                            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50">
                                {previewUrl || user?.avatar_url ? (
                                    <img src={previewUrl || user?.avatar_url} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-semibold text-slate-300">
                                        {(editName || user?.email || 'U').slice(0, 1).toUpperCase()}
                                    </span>
                                )}
                                <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                                    <FileUpload className="text-white" />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setEditAvatar(e.target.files[0]);
                                                setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                            }
                                        }} 
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-slate-500">Click avatar to upload new</p>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Display Name</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)] focus:bg-white"
                                    placeholder="Enter your name"
                                />
                            </div>
                            {editError ? (
                                <p className="text-sm text-red-600">{editError}</p>
                            ) : null}
                        </div>

                        <div className="mt-8">
                            <button 
                                onClick={submitProfileUpdate}
                                disabled={editLoading}
                                className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:bg-[var(--accent)]/90 disabled:opacity-70"
                            >
                                {editLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
