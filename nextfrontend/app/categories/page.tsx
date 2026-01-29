'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import apiService from '../services/apiService';
import { Product } from '../utils/types';
import ProductCard from '../components/ProductCard';

export default function Category() {
    const categoryNameParam = useSearchParams();
    const queryCategory = categoryNameParam.get('name');
    const [categoryName, setCategoryName] = useState<string>('All');
    const [listData, setListData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const page = 1;
    const router = useRouter();

    useEffect(() => {
        if (queryCategory) {
            setCategoryName(queryCategory);
        }
    }, [queryCategory]);

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                // Determine the correct endpoint based on whether "All" is selected or a specific category
                // Assuming backend handles 'All' or there is a specific endpoint for it. 
                // If 'All' simply fetches everything, we might need a different API call or the backend supports it.
                // Keeping existing logic structure but ensuring generic 'All' handling if supported.

                const endpoint = `/api/core/category/${categoryName}/?page=${page}`;
                const response = await apiService.getWithoutToken(endpoint);

                if (response && response.results) {
                    setListData(response.results);
                } else {
                    setListData([]);
                }

            } catch (error) {
                console.error('Error fetching category list:', error);
                setListData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [categoryName]);


    const categories = [
        "All",
        "watch",
        "Laptop",
        "Desktop Computer",
        "Tablet",
        "Television",
        "Headphones",
        "Shirts",
        "Jeans",
        "Suits",
        "Leggings",
        "Sandals",
        "Shoes",
        "High Heels"
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <aside className="w-full md:w-1/4 lg:w-1/5">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-card glass rounded-2xl p-6 border border-white/10 shadow-sm">
                                <h3 className="text-lg font-bold text-foreground mb-4">Categories</h3>
                                <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1 pb-4 md:pb-0">
                                    {categories.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCategoryName(item)}
                                            className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                                ${categoryName === item
                                                    ? 'bg-primary text-primary-foreground shadow-md'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="w-full md:w-3/4 lg:w-4/5">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent capitalize">
                                {categoryName} Collection
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Explore our latest range of {categoryName === 'All' ? 'products' : categoryName}.
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="bg-card rounded-2xl h-[300px] animate-pulse" />
                                ))}
                            </div>
                        ) : listData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {listData.map((item) => (
                                    <ProductCard key={item.id} product={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-2xl">
                                    🔍
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">No products found</h3>
                                <p className="text-muted-foreground mt-2">Try selecting a different category.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
