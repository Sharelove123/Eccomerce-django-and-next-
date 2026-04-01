import React from 'react';

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Engineering Blog</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-slate-500 mb-12">
          Insights, updates, and deep dives into the technology powering our e-commerce platform.
        </p>
        
        <article className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-12">
          <span className="text-primary text-sm font-bold tracking-wider uppercase">Architecture</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">Scaling Django & Next.js to Millions</h2>
          <p className="text-slate-500 mb-4">April 1, 2026</p>
          <p className="mb-4">
            In this post, we explore the intricate details of marrying a robust Django PostgreSQL backend with an edge-rendered Next.js frontend, ensuring zero-latency transitions and optimal search engine ranking.
          </p>
          <span className="text-primary font-medium hover:underline cursor-pointer">Read more →</span>
        </article>

        <article className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-12">
          <span className="text-primary text-sm font-bold tracking-wider uppercase">Design</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">The Psychology of a Perfect Checkout</h2>
          <p className="text-slate-500 mb-4">March 15, 2026</p>
          <p className="mb-4">
            A frictionless checkout is the holy grail of conversions. We break down the cognitive load reduction techniques implemented in our latest cart redesign.
          </p>
          <span className="text-primary font-medium hover:underline cursor-pointer">Read more →</span>
        </article>

      </div>
    </div>
  );
}
