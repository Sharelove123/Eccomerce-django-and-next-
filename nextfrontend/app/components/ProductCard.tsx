'use client';

import React from 'react';
import { Product } from "@/app/utils/types";
import { useRouter } from 'next/navigation';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();
    const hasDiscount = Boolean(product.discountedPrice && product.discountedPrice !== product.orginalPrice);

    return (
        <div
            onClick={() => router.push(`/product/${product.id}`)}
            className="group premium-panel relative flex-shrink-0 w-72 overflow-hidden rounded-[2rem] cursor-pointer hover:-translate-y-1.5"
        >
            <div className="relative h-56 w-full overflow-hidden bg-[linear-gradient(180deg,#fbf8f2,#f2eadf)] p-5">
                {hasDiscount && (
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                        Sale
                    </div>
                )}
                <img
                    src={product.imagelist?.img1 || `https://picsum.photos/seed/product${product.id}/500/500`}
                    alt={product.title || "Product Image"}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                            {product.category?.name || "Item"}
                        </span>
                        <h3 className="mt-3 text-[1.35rem] font-semibold leading-tight text-slate-950">
                            {product.title || "Amazing Product"}
                        </h3>
                    </div>
                    {product.vendor?.store_name && (
                        <span className="text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {product.vendor.store_name}
                        </span>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Price</p>
                        <div className="mt-1 flex items-center gap-3">
                            <span className="text-2xl font-bold text-slate-950">
                                ${product.discountedPrice || product.orginalPrice || "99.00"}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-slate-400 line-through">
                                    ${product.orginalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="rounded-full bg-[rgba(184,131,71,0.14)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--secondary)]">
                        View
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
