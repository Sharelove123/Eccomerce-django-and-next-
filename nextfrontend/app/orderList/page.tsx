'use client';

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";
import { Order, OrderItemList } from "@/app/utils/types";
import { Typography, Card, CardContent, CardActions, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter();
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiService.get('/api/cart/listorder/');
                setOrders(response);
                console.log(response);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="flex flex-col items-center mt-16">
            <Typography variant="h4" gutterBottom>
                Order List
            </Typography>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <Card key={order.id} className="w-3/4 mb-4 shadow-md">
                        <CardContent>
                            <Typography variant="h6">Order ID: {order.id}</Typography>
                            <Typography variant="body1">Total Price: ${order.total_price}</Typography>
                            <Typography variant="body2">Address: {order.address.street_name} , {order.address.city}</Typography>
                            <Typography variant="body2">Status: {order.delivered ? "Delivered" : "Pending"}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => {
                                router.push(
                                    `/orderitemlist/${order.id}`
                                );
                            }}>
                                View Details
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <Typography variant="body1">No orders found.</Typography>
            )}
        </div>
    );
};

export default OrderList;
