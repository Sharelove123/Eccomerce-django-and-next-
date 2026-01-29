import { Button } from "@mui/material"; // Removing this later if possible, but keeping for now if used elsewhere? No, I'll use Tailwind buttons.
import ProductList from "./components/home/ProductList";
import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Hero Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image with Parallax-like fixity or just cover */}
        <div className="absolute inset-0">
          <img
            src="/ecbannerimage.webp"
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
          <div className="max-w-2xl animate-in slide-in-from-bottom-10 fade-in duration-700">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-semibold mb-6 backdrop-blur-md">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Extraordinary</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
              Upgrade your lifestyle with our premium selection of tech gadgets.
              Designed for performance, crafted for elegance.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary/25 flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowForward fontSize="small" />
              </Link>
              <Link
                href="/categories/?name=All"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold transition-all"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories (Optional, or just jump to lists) - Let's jump to lists for now */}

      <div className="space-y-12 mt-12">
        {/* Watch List */}
        <ProductList title="Trending Watches" category="watch" />

        {/* Tablet List */}
        <ProductList title="Top Rated Tablets" category="Tablet" />

        {/* Laptop List */}
        <ProductList title="High Performance Laptops" category="Laptop" />
      </div>

    </div>
  );
}
