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
                const response = await apiService.getWithoutToken(`/api/core/category/${encodeURIComponent(category)}/?page=1`);
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
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="eyebrow text-slate-500">Collection</p>
                        <h2 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
                            {title}
                        </h2>
                        <div className="mt-3 h-px w-24 bg-[linear-gradient(90deg,#8a6742,#d1a368)]"></div>
                    </div>
                    <Link
                        href={`/categories/?name=${encodeURIComponent(category)}`}
                        className="premium-outline group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-800"
                    >
                        <span>View All</span>
                        <ArrowForward fontSize="small" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative group/list">
                    <div
                        className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="premium-panel flex-shrink-0 w-72 h-80 rounded-[2rem] animate-pulse"></div>
                            ))
                            : products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        }
                    </div>

                    <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default ProductList;
