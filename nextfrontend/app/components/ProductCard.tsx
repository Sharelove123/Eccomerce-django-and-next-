'use client';

import React from 'react';
import { Product } from "@/app/utils/types";
import { useRouter } from 'next/navigation';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/product/${product.id}`)}
            className="group relative flex-shrink-0 w-72 bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="relative h-48 w-full bg-muted flex items-center justify-center p-4 overflow-hidden">
                <img
                    src={product.imagelist.img1}
                    alt={product.title || "Product Image"} // Assuming Product type has title, if not fallback
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">
                        {product.category?.name || "Item"}
                    </span>
                </div>
                <h3 className="text-lg font-medium text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                    {product.title || "Amazing Product"}
                </h3>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-foreground">
                        ${product.discountedPrice || product.orginalPrice || "99.00"}
                    </span>
                    {product.discountedPrice && product.discountedPrice !== product.orginalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            ${product.orginalPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
