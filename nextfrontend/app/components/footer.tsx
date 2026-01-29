'use client'

import { Facebook, Instagram, Twitter, WhatsApp, X } from '@mui/icons-material';
import Link from 'next/link';
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wider uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-fit">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <span>📍</span>
                <span>New Delhi, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>+91 111 111 1111</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️</span>
                <span>support@eccomerce.com</span>
              </li>
            </ul>
          </div>

          {/* Website Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-all duration-300 group">
                <Facebook fontSize="small" className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-all duration-300 group">
                <X fontSize="small" className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-all duration-300 group">
                <Instagram fontSize="small" className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-all duration-300 group">
                <WhatsApp fontSize="small" className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <p className="text-xs text-slate-500 pt-4">© 2026 Eccomerce Inc. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
