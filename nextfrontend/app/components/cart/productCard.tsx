'use client'

import { CartItem } from '@/app/utils/types';
import React, { useEffect } from 'react';
import { Bungee, Lilita_One, JetBrains_Mono } from "next/font/google";

const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });
const mono = JetBrains_Mono({ subsets: ['latin'] });

interface cartItemProps {
    cartItem: CartItem;
    removeFromCart: (productId: number) => void;
    updateCart: (productId: number, incdecinfo: String) => void;
}

const ProductCard: React.FC<cartItemProps> = ({ cartItem, removeFromCart, updateCart }) => {
    const [productQuantity, setproductQuantity] = React.useState<number>(1);
    const [isHovered, setIsHovered] = React.useState(false);

    useEffect(() => {
        setproductQuantity(Number(cartItem.quantity));
    }, [cartItem.quantity])

    const image = cartItem.product.imagelist.img1;
    const price = cartItem.product.discountedPrice || cartItem.product.orginalPrice;
    const total = price ? price * productQuantity : 0;

    return (
        <div
            className="group relative flex flex-col sm:flex-row items-stretch gap-0 border border-black bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Remove Button - Top Right Absolute */}
            <button
                onClick={() => removeFromCart(cartItem.product.id)}
                className="absolute top-0 right-0 z-10 p-2 bg-black text-white hover:bg-red-600 transition-colors"
                title="Remove item"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Product Image Section */}
            <div className="relative w-full sm:w-40 border-b sm:border-b-0 sm:border-r border-black p-4 flex items-center justify-center bg-gray-50">
                <div className="w-24 h-24 relative overflow-hidden mix-blend-multiply">
                    <img
                        className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        src={image}
                        alt={cartItem.product.title}
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 w-full flex flex-col justify-between p-6 gap-4">
                <div className="flex flex-col gap-1 pr-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-black text-white px-2 py-0.5">
                            {cartItem.product.category?.name || 'Item'}
                        </span>
                    </div>
                    <h3 className={`${lilita_One.className} text-xl md:text-2xl text-black uppercase tracking-tight leading-none`}>
                        {cartItem.product.title}
                    </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                    {/* Quantity Control - Brutalist Style */}
                    <div className="flex items-center border border-black bg-white">
                        <button
                            className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black border-r border-black"
                            onClick={() => {
                                if (productQuantity > 1) {
                                    setproductQuantity(productQuantity - 1);
                                    updateCart(cartItem.product.id, 'decrement');
                                }
                            }}
                            disabled={productQuantity <= 1}
                        >
                            <span className="text-xl font-bold font-mono">-</span>
                        </button>

                        <span className={`w-12 text-center font-bold text-black ${mono.className}`}>
                            {productQuantity}
                        </span>

                        <button
                            className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors border-l border-black"
                            onClick={() => {
                                setproductQuantity(productQuantity + 1);
                                updateCart(cartItem.product.id, 'increment');
                            }}
                        >
                            <span className="text-xl font-bold font-mono">+</span>
                        </button>
                    </div>

                    {/* Price Info */}
                    <div className="flex flex-col items-end">
                        <p className={`text-xs text-gray-500 uppercase tracking-widest ${mono.className}`}>Total Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-black text-black ${mono.className}`}>
                                ${productQuantity * Number(price)}
                            </span>
                            {(cartItem.product.discountedPrice && cartItem.product.discountedPrice !== cartItem.product.orginalPrice) && (
                                <span className="text-sm text-gray-400 line-through decoration-2">
                                    ${cartItem.product.orginalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;
