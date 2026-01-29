'use client';

import { Address, CartItem } from "@/app/utils/types";
import { useEffect, useState } from "react";
import React from "react";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";
import { getUserId } from "@/app/lib/actions";
import SimpleSnackbar from "../snackbar";
import PayPalButton from "../payment/paypalbutton";
import { JetBrains_Mono, Bungee } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ['latin'] });
const bungee = Bungee({ weight: '400', subsets: ['latin'] });

interface totalPriceProp {
    totalPrice: number,
    selectedAddress: number | null;
    setSelectedAddress: (id: number) => void;
    onCartChange: () => void;
}

const Summary: React.FC<totalPriceProp> = ({ totalPrice, selectedAddress, setSelectedAddress, onCartChange }) => {
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [msg, setMsg] = useState('ORDER PROCESSED');
    const [open, setOpen] = React.useState(false);
    const [orderId, setOrderId] = React.useState(36);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [errors, setErrors]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);

    const handleClick = () => {
        setOpen(true);
    };

    const submitOrder = async (details: any) => {
        const formData = new FormData();
        const userId = await getUserId();
        if (!userId) {
            setErrors((prevErrors) => [...prevErrors, 'USER ID REQUIRED']);
            return;
        }

        formData.append('user', userId.toString());

        if (!selectedAddress) {
            setErrors((prevErrors) => [...prevErrors, 'ADDRESS REQUIRED']);
            return;
        }

        formData.append('address', selectedAddress.toString());
        formData.append('paid', 'True');

        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const orderItems = cartItems.map((item: CartItem) => ({
            product: item.product.id,
            quantity: item.quantity,
        }));

        formData.append('order_items', JSON.stringify(orderItems));

        try {
            setLoading(true);
            const response = await apiService.post('/api/cart/createorder/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 'success') {
                localStorage.removeItem('cart');
                setMsg(response.message.toUpperCase());
                handleClick();
                onCartChange();
                setOrderId(response.order_id);
            }
            if (response.status === 'failed') {
                setMsg(response.message.toUpperCase());
                handleClick();
                router.refresh();
            }
        } catch (error) {
            console.error('Error creating order:', error);
            setMsg('SYSTEM ERROR: ORDER FAILED');
            handleClick();
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (details: any) => {
        await submitOrder(details);
        setMsg('PAYMENT VERIFIED');
        localStorage.removeItem('cart');
        handleClick();
        onCartChange();
    };

    const getAddressDetail = async (addressId: number) => {
        if (!isNaN(addressId) && addressId !== 0) {
            try {
                const result = await apiService.get(`/api/cart/addresses/${addressId}/`);
                return result;
            } catch (e) {
                return null;
            }
        } else {
            return 0
        }
    }

    useEffect(() => {
        const fetchAddressDetail = async () => {
            const addressId = parseInt(localStorage.getItem('selectedAddress') || '0');
            if (addressId) {
                const addressDetail: Address = await getAddressDetail(addressId);
                if (addressDetail) {
                    setApartmentNumber(addressDetail.apartment_number);
                    setStreetAddress(addressDetail.street_name);
                    setCity(addressDetail.city);
                    setState(addressDetail.state);
                    setPostalCode(addressDetail.postal_code);
                    setCountry(addressDetail.country);
                }
            }
        };
        fetchAddressDetail();
    }, [selectedAddress])

    return (
        <div className="w-full lg:w-2/5 flex flex-col gap-6 sticky top-24">
            <div className="bg-white border-2 border-black p-0 relative brutal-shadow">

                {/* Header */}
                <div className="bg-black p-4">
                    <h3 className={`text-xl text-white uppercase tracking-widest ${mono.className}`}>
                        Total_Calculations
                    </h3>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    {errors.length > 0 && (
                        <div className="p-4 border-2 border-red-600 bg-red-50 text-red-600 font-bold uppercase tracking-wide decoration-slice">
                            {errors.map((error, index) => (
                                <p key={index} className="flex items-center gap-2">
                                    <span>[!]</span> {error}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Cost Breakdown */}
                    <div className={`space-y-4 ${mono.className}`}>
                        <div className="flex justify-between items-center text-sm uppercase tracking-wider">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold text-black">${totalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm uppercase tracking-wider">
                            <span className="text-gray-500">Shipping</span>
                            <span className="bg-black text-white px-2 py-0.5 text-xs font-bold">FREE</span>
                        </div>

                        <div className="flex justify-between items-center text-sm uppercase tracking-wider">
                            <span className="text-gray-500">Tax</span>
                            <span className="font-bold text-black">$0.00</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b-2 border-dashed border-gray-300 my-6" />

                    {/* Total */}
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold uppercase tracking-widest text-black">Total Due</span>
                        <span className={`text-4xl font-black text-black tracking-tight ${mono.className}`}>
                            ${totalPrice.toFixed(2)}
                        </span>
                    </div>

                    {/* Address Section */}
                    <div className="py-6 border-t-2 border-black mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 inline-block">
                                Destination
                            </h4>
                            {city && (
                                <button className="text-xs font-bold underline hover:bg-black hover:text-white px-1 transition-colors">
                                    CHANGE
                                </button>
                            )}
                        </div>

                        {city ? (
                            <div className="font-mono text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 border border-gray-200">
                                <p className="font-bold text-black">{apartmentNumber} {streetAddress}</p>
                                <p>{city}, {state} {postalCode}</p>
                                <p className="uppercase">{country}</p>
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-dashed border-gray-300 text-center text-xs uppercase tracking-widest text-gray-400">
                                NO DESTINATION SELECTED
                            </div>
                        )}
                    </div>

                    {/* Payment */}
                    <div className="space-y-4">
                        <div className="bg-black text-white text-center py-2 text-xs font-bold uppercase tracking-[0.2em]">
                            SECURE CHECKOUT
                        </div>
                        <div className="hover:grayscale transition-all duration-300">
                            <PayPalButton totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />
                        </div>
                    </div>
                </div>
            </div>
            <SimpleSnackbar open={open} setOpen={setOpen} msg={msg} />
        </div>
    )
}

export default Summary;
