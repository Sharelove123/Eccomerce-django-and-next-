import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-slate-500 mb-8">
          Last updated: April 2026
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">1. Information We Collect</h2>
        <p className="mb-6">
          This is an educational showcase project. Under normal circumstances, an e-commerce platform collects basic account details (Name, Email), shipping addresses, and payment processing metadata. Please be advised that <strong>no real purchases</strong> can be made here and you should not upload any sensitive personal information.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">2. How We Use Data</h2>
        <p className="mb-6">
          The simulated data entered into this platform is stored securely via Supabase PostgreSQL, strictly for the purpose of demonstrating Django backend integrations, Next.js frontend state management, and real-time JWT authentication flows.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">3. Data Security</h2>
        <p className="mb-6">
          All endpoints are secured via Django Rest Framework JWT Middleware, and database access is protected through strict Row Level Security (RLS) policies within the connected cloud environment.
        </p>
      </div>
    </div>
  );
}
