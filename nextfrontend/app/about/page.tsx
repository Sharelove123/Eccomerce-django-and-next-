import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">About Us</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-slate-500 mb-8">
          Welcome to Modern Ecommerce, where we redefine online shopping through innovation and exceptional customer experience.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
        <p className="mb-6">
          Our mission is simply to provide the best possible online shopping platform for our users. We carefully curate our product selection, optimize our logistics, and prioritize a seamless, hyper-fast checkout experience.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4">The Team</h2>
        <p className="mb-6">
          Behind our digital storefront is a team of passionate engineers, designers, and e-commerce veterans dedicated to building the future of retail. While this specific instance serves as an educational portfolio showcase, it perfectly mirrors the complex architecture and beautiful design standards demanded by today's leading brands.
        </p>
      </div>
    </div>
  );
}
