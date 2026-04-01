import React from 'react';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Help Center</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-slate-500 mb-8">
          Answers to your most frequently asked questions.
        </p>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold">Q: Can I actually buy these products?</h3>
            <p className="mt-2 text-slate-500">
              A: No. This entire application is a student portfolio piece designed to showcase Full-Stack Architecture, API integration, and database management. The products are auto-seeded placeholders.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold">Q: I found a bug, how do I report it?</h3>
            <p className="mt-2 text-slate-500">
              A: Use the Contact Us form located in the footer or primary navigation menu. That form will simulate an email or database entry dispatching to the admin!
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold">Q: How do I test the Admin dashboard?</h3>
            <p className="mt-2 text-slate-500">
              A: If you have been provided with the admin credentials for this project demonstration, you can navigate to the /admin route on the Django backend URL to explore the interface.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
