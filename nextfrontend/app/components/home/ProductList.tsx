'use client';

import apiService from "@/app/services/apiService";
import { useEffect, useState } from "react";
import { Product } from "@/app/utils/types"; // Ensure this type matches your API response
import ProductCard from "../ProductCard";
import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";

interface ProductListProps {
    title: string;
    category: string;
}

const ProductList: React.FC<ProductListProps> = ({ title, category }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            // Assuming your API endpoint structure is reusable like this
            try {
                const response = await apiService.getWithoutToken(`/api/core/category/${category}/?page=1`);
                console.log(`Fetched ${category}:`, response);
                if (response.results) {
                    setProducts(response.results);
                }
            } catch (error) {
                console.error(`Error fetching ${category}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    if (!loading && products.length === 0) {
        return null; // Don't show empty sections
    }

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            {title}
                        </h2>
                        <div className="h-1 w-20 bg-primary mt-2 rounded-full"></div>
                    </div>
                    <Link
                        href={`/categories/?name=${category}`}
                        className="group flex items-center space-x-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        <span>View All</span>
                        <ArrowForward fontSize="small" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Horizontal Scroll Interface */}
                <div className="relative group/list">
                    <div
                        className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-72 h-80 bg-muted rounded-2xl animate-pulse"></div>
                            ))
                            : products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        }
                    </div>

                    {/* Fade effect on right edge to indicate scroll */}
                    <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default ProductList;
