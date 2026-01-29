'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleLogout } from '@/app/lib/actions';
import Link from 'next/link';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        // Since we don't have a direct profile API in the snippet, we'll simulate or read from local storage if available
        // Or just show a generic profile for now.
        // real implementation would likely fetch from /api/user/me/
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Fallback
            setUser({ name: 'Valued Customer', email: 'user@example.com' });
        }
    }, []);

    const onLogout = async () => {
        await handleLogout();
        router.push('/signin');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg relative">
                    {/* Cover Banner */}
                    <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-6">
                            <div className="h-32 w-32 rounded-full border-4 border-card bg-muted flex items-center justify-center text-4xl shadow-xl">
                                👤
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-1">
                                    {user?.name || 'Hello!'}
                                </h1>
                                <p className="text-muted-foreground">{user?.email}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="px-6 py-2 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-semibold"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <Link href="/orderList" className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        📦
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">My Orders</h3>
                                        <p className="text-sm text-muted-foreground">View order history and status</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>

                            <Link href="/cart" className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                                        🛒
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Shopping Cart</h3>
                                        <p className="text-sm text-muted-foreground">View items in your cart</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
