'use client'
import * as React from 'react';
import { CartItem } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import ProductCard from './productCard';
import SimpleSnackbar from '../snackbar';
import Link from 'next/link';
import { Lilita_One, JetBrains_Mono } from "next/font/google";

const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });
const mono = JetBrains_Mono({ subsets: ['latin'] });

interface CartProductListProps {
    onCartChange: () => void;
}

const CartProductList: React.FC<CartProductListProps> = ({ onCartChange }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = useState('');

    const handleClick = () => {
        setOpen(true);
    };

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(storedCartItems);
    }, []);

    const removeFromCart = (productId: number) => {
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = existingCart.filter((item: any) => item.product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
        onCartChange();
        setMsg('ITEM REMOVED');
        handleClick();
    };

    const updateCart = (productId: number, incdecinfo: String) => {
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const productIndex = existingCart.findIndex((item: any) => item.product.id === productId);

        if (productIndex !== -1) {
            if (incdecinfo == 'increment') {
                existingCart[productIndex].quantity = existingCart[productIndex].quantity + 1;
            } else {
                if (existingCart[productIndex].quantity > 1) {
                    existingCart[productIndex].quantity = existingCart[productIndex].quantity - 1;
                }
            }
            localStorage.setItem('cart', JSON.stringify(existingCart));
            setCartItems(existingCart);
        }
        onCartChange();
        setMsg('CART UPDATED');
        handleClick();
    };

    // Empty State - Brutalist Style
    if (cartItems.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300 bg-gray-50/50">
                <h3 className={`text-4xl md:text-6xl font-black text-black uppercase mb-4 tracking-tighter ${lilita_One.className}`}>
                    Cart Void
                </h3>
                <p className={`text-gray-500 mb-8 uppercase tracking-widest text-xs md:text-sm ${mono.className}`}>
                    0 Items Detected // Initialization Required
                </p>
                <Link href="/" className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Initiate Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className="flex items-end justify-between border-b-4 border-black pb-4 mb-8">
                <h2 className={`text-4xl font-black text-black uppercase tracking-tighter leading-none ${lilita_One.className}`}>
                    Inventory
                </h2>
                <div className={`bg-black text-white px-3 py-1 font-bold text-sm select-none ${mono.className}`}>
                    COUNT: {cartItems.length}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {cartItems.map((item: CartItem, index: number) => (
                    <div
                        key={index}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <ProductCard
                            cartItem={item}
                            removeFromCart={removeFromCart}
                            updateCart={updateCart}
                        />
                    </div>
                ))}
            </div>

            <SimpleSnackbar open={open} setOpen={setOpen} msg={msg} />
        </div>
    );
}

export default CartProductList;
