import React from 'react';

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Cookie Policy</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-slate-500 mb-8">
          Understanding how this platform tracks session state.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">Authentication Cookies</h2>
        <p className="mb-6">
          We utilize HttpOnly, strict-domain Cookies via Next.js server actions to securely maintain your authentication state across the application without unnecessarily exposing tokens to the browser's JavaScript context. 
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">Session Management</h2>
        <p className="mb-6">
          If you wish to terminate these cookies, simply select the 'Sign Out' option situated within the primary navigation menu. This will sever the connection and wipe the active JWT tokens.
        </p>

      </div>
    </div>
  );
}
