import React from 'react';

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Careers</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-slate-500 mb-8">
          Join our mission to revolutionize the digital retail space. We're looking for passionate individuals who love pushing the boundaries of technology.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4">Open Positions</h2>
        
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold">Senior Full-Stack Engineer</h3>
          <p className="text-slate-500 text-sm mb-4">Remote / New Delhi</p>
          <p>We are seeking an experienced developer well-versed in React, Next.js, and Django REST Framework to scale our platform architecture.</p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold">UI/UX Product Designer</h3>
          <p className="text-slate-500 text-sm mb-4">Remote</p>
          <p>Looking for a creative mind to continually refine our "wow-factor" design system and streamline user checkout flows.</p>
        </div>

        <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Don't see a fit?</h3>
          <p className="text-slate-500">Send your resume to careers@eccomerce.com and we'll keep you in mind for future roles.</p>
        </div>
      </div>
    </div>
  );
}
