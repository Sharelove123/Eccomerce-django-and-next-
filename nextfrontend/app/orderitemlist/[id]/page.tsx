'use client'

import * as React from 'react';
import apiService from '@/app/services/apiService';
import { useParams, useRouter } from 'next/navigation';
import { OrderItemList } from '@/app/utils/types';
import Link from 'next/link';
import Image from 'next/image';

function OrderItemListPage() {
    const { id } = useParams();
    const [orderItemList, setOrderItemList] = React.useState<OrderItemList[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await apiService.get(`/api/cart/listorderitem/?orderID=${id}`);
                    setOrderItemList(response);
                } catch (error) {
                    console.error('Error fetching order items:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-card rounded-2xl animate-pulse border border-border" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!orderItemList || orderItemList.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6 text-4xl">
                    📄
                </div>
                <h2 className="text-xl font-bold text-foreground mb-4">No items found for this order.</h2>
                <Link href="/orderList" className="text-primary hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    // Calculate total from items if needed, or just display them
    const totalItems = orderItemList.reduce((acc, item) => acc + Number(item.quantity), 0);
    const orderTotal = orderItemList.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors text-foreground"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
                        <p className="text-muted-foreground text-sm">Order #{id}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Items List */}
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border bg-muted/20">
                            <h2 className="text-lg font-bold text-foreground">Items Ordered ({totalItems})</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {orderItemList.map((item) => (
                                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-muted/5 transition-colors">
                                    <div className="h-20 w-20 relative flex-shrink-0 bg-white rounded-xl border border-border overflow-hidden">
                                        <Image
                                            src={item.product.imagelist.img1}
                                            alt={item.product.title}
                                            fill
                                            className="object-contain p-2"
                                            sizes="80px"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-foreground text-lg mb-1">{item.product.title}</h3>
                                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                            <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">Qty: {item.quantity.toString()}</span>
                                            {/* Add more details if available */}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto flex justify-between sm:block">
                                        <span className="sm:hidden text-muted-foreground">Price</span>
                                        <span className="text-xl font-bold text-foreground block">
                                            ${Number(item.total_price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-between items-center">
                            <span className="font-medium text-foreground">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">${orderItemList.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderItemListPage
