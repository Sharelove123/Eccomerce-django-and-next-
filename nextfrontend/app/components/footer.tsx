'use client'

import { Facebook, Instagram, LinkedIn, X } from '@mui/icons-material';
import Link from 'next/link';
import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-[linear-gradient(180deg,rgba(24,27,32,0.98),rgba(17,20,25,1))] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div className="max-w-md">
            <p className="eyebrow text-slate-500">Modern Commerce</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">A cleaner storefront for thoughtful buying.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Explore considered product collections, direct vendor conversations, and a shopping flow designed to feel composed rather than cluttered.
            </p>
          </div>

          <div>
            <p className="eyebrow text-slate-500">Explore</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <Link href="/about" className="hover:text-white">About Us</Link>
              <Link href="/contactus" className="hover:text-white">Contact</Link>
              <Link href="/categories/?name=All" className="hover:text-white">Products</Link>
              <Link href="/blog" className="hover:text-white">Journal</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow text-slate-500">Support</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <Link href="/help" className="hover:text-white">Help Center</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/cookies" className="hover:text-white">Cookies</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow text-slate-500">Connect</p>
            <div className="mt-5 flex gap-3">
              {[Facebook, X, Instagram, LinkedIn].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <Icon fontSize="small" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              New Delhi, India
              <br />
              support@eccomerce.com
              <br />
              +91 111 111 1111
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.18em] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>2026 Eccomerce. All rights reserved.</p>
          <p>Curated interface. Student showcase build.</p>
        </div>
      </div>
    </footer>
  )
}
