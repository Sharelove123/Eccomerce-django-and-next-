'use client'

import SimpleSnackbar from '@/app/components/snackbar';
import apiService from '@/app/services/apiService';
import { Product } from '@/app/utils/types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Lilita_One, Abril_Fatface } from "next/font/google";

const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });
const abril_Fatface = Abril_Fatface({ weight: '400', subsets: ['latin'] });

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setselectedImage] = useState<string>('');
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClick = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await apiService.getWithoutToken(`/api/core/getproduct/${id}`);
                    setProduct(response);
                    if (response.imagelist) {
                        setselectedImage(response.imagelist.img1);
                    }
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };

            fetchProduct();
        }
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-indigo-600 font-medium animate-pulse">Loading Product...</p>
                </div>
            </div>
        );
    }

    const addToCart = (product: Product) => {
        const serializableProduct = {
            product: {
                id: product.id,
                category: product.category,
                title: product.title,
                rateing: product.rateing,
                price: product.orginalPrice,
                discountedPrice: product.discountedPrice,
                discount: product.get_discount_percentage,
                discription: product.discription,
                imagelist: product.imagelist,
            },
            quantity: quantity
        };

        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const productIndex = existingCart.findIndex((item: any) => item.product.id === serializableProduct.product.id);

        if (productIndex !== -1) {
            existingCart[productIndex].quantity += quantity;
            setMsg('Product quantity updated');
        } else {
            existingCart.push({ ...serializableProduct });
            setMsg('Added to your collection');
        }

        localStorage.setItem('cart', JSON.stringify(existingCart));
        handleClick();
        window.dispatchEvent(new Event('storage'));
    };

    const images = product.imagelist ? [
        product.imagelist.img1,
        product.imagelist.img2,
        product.imagelist.img3,
        product.imagelist.img4
    ].filter(Boolean) : [];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent -z-10" />
            <div className="absolute top-20 left-10 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                    {/* Left Column: Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        {/* Main Image Stage */}
                        <div
                            className="aspect-[4/5] w-full relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 border border-white/60 group"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 to-transparent pointer-events-none z-10" />
                            <img
                                src={selectedImage || images[0]}
                                alt={product.title}
                                className={`w-full h-full object-contain p-12 transition-all duration-700 ease-in-out ${isHovered ? 'scale-110 drop-shadow-xl' : 'scale-100'}`}
                            />

                            {/* Floating Badge */}
                            {product.get_discount_percentage && (
                                <div className="absolute top-8 left-8 z-20 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold shadow-lg animate-fade-in">
                                    -{product.get_discount_percentage}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setselectedImage(img)}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-2xl bg-white p-2 border-2 transition-all duration-300 overflow-hidden ${selectedImage === img ? 'border-indigo-600 shadow-lg shadow-indigo-200/50 scale-105' : 'border-transparent hover:border-indigo-200'}`}
                                >
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                                    {selectedImage === img && (
                                        <div className="absolute inset-0 bg-indigo-600/10" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Info Panel */}
                    <div className="w-full lg:w-1/2 lg:sticky lg:top-32 h-fit">
                        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden animate-fade-in delay-100 border border-white/60 shadow-xl shadow-indigo-100/50">

                            {/* Decorative gradient inside panel */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-indigo-50 text-indigo-600 tracking-wide uppercase mb-4 shadow-sm border border-indigo-100">
                                        {product.category?.name || "Collection"}
                                    </span>
                                    <h1 className={`${abril_Fatface.className} text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight mb-4`}>
                                        {product.title}
                                    </h1>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} className={`w-5 h-5 ${star <= (product.rateing || 0) ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-slate-400 font-medium text-sm">({product.rateing || 0} Reviews)</span>
                                    </div>
                                </div>

                                {/* Price Block */}
                                <div className="flex items-baseline gap-4">
                                    <span className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 ${lilita_One.className}`}>
                                        ${product.discountedPrice || product.orginalPrice}
                                    </span>
                                    {(product.discountedPrice && product.discountedPrice !== product.orginalPrice) && (
                                        <span className="text-2xl text-slate-400 line-through decoration-slate-400/50 font-medium decoration-2">
                                            ${product.orginalPrice}
                                        </span>
                                    )}
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-slate-200 to-transparent" />

                                {/* Description */}
                                <div className="prose prose-slate text-slate-500 leading-relaxed relative">
                                    <p className={isExpanded ? "" : "line-clamp-3"}>
                                        {product.discription}
                                    </p>
                                    {product.discription && product.discription.length > 200 && (
                                        <button
                                            onClick={toggleExpand}
                                            className="text-indigo-600 font-bold hover:underline mt-2 text-sm uppercase tracking-wide flex items-center gap-1"
                                        >
                                            {isExpanded ? "Show Less" : "Read Full Details"}
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Actions Base */}
                                <div className="pt-4 space-y-6">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">Quantity</span>
                                        <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-bold text-slate-800">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-50 text-indigo-600 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="flex-1 bg-slate-900 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group"
                                        >
                                            <span>Add to Cart</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </button>
                                        <button className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-200 transition-all">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SimpleSnackbar open={open} setOpen={setOpen} msg={msg} />
        </div>
    )
}
