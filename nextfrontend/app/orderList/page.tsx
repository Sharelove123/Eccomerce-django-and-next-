'use client';

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";
import { Order } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiService.get('/api/cart/listorder/');
                // Ensure response is an array, handle if it's paginated or wrapped
                setOrders(Array.isArray(response) ? response : response.results || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (delivered: boolean) => {
        return delivered
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
                    <Link href="/" className="text-sm font-medium text-primary hover:underline">
                        Continue Shopping
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-card rounded-2xl animate-pulse border border-border" />
                        ))}
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-card border border-border rounded-2xl p-6 transition-all hover:shadow-lg hover:border-primary/20 group"
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-foreground">
                                                Order #{order.id}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.delivered)}`}>
                                                {order.delivered ? "Delivered" : "In Progress"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {/* Date could be added here if available in API */}
                                            Placed on {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total Amount</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            ${order.total_price}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-6 border-t border-border">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Shipping To
                                        </p>
                                        <p className="text-sm text-foreground">
                                            {order.address.apartment_number} {order.address.street_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.address.city}, {order.address.country}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/orderitemlist/${order.id}`)}
                                        className="w-full md:w-auto px-6 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-transform active:scale-95"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-3xl">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 text-4xl">
                            📦
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
                        <Link href="/" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-transform active:scale-95">
                            Browse Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
