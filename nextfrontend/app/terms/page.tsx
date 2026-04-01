import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms & Conditions</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-slate-500 mb-8">
          Effective as of April 2026
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">1. Introduction</h2>
        <p className="mb-6">
          By accessing and using this web application, you acknowledge that this is a portfolio showcase built strictly for educational and demonstrational purposes. The items listed are non-tangible and cannot be fulfilled.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">2. User Accounts</h2>
        <p className="mb-6">
          You are free to create an account, log in, add items to your cart, and navigate the application structure to interact with the Django REST API. We reserve the right to wipe the database at any point for maintenance.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">3. Intellectual Property</h2>
        <p className="mb-6">
          The code, architectural layouts, and Next.js frontend optimizations demonstrated here stand as the intellectual property of the developer building this platform showcase.
        </p>
      </div>
    </div>
  );
}
