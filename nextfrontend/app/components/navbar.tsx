'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { resetAuthCookies } from '../lib/actions';
import { ShoppingCart, Person, Menu as MenuIcon, Close as CloseIcon, Logout, ShoppingBag } from '@mui/icons-material';
import Link from 'next/link';
// We will replace the external drawer with an internal Tailwind one for better coherence
// import SwipeableTemporaryDrawer from './drawermoble'; 

interface Props {
  userId: string | null;
}

export default function PrimarySearchAppBar({ userId }: Props) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Handle scroll for glass effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await resetAuthCookies();
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' }, // Assuming this route exists or will exist
    { name: 'Categories', href: '/categories/?name=All' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm dark:bg-slate-900/70' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ECCOMERCE
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm lg:text-base"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {userId ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Person fontSize="small" />
                  </div>
                  <span className="text-sm font-medium">Account</span>
                </button>

                {/* Dropdown User Menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 animate-in fade-in slide-in-from-top-5 duration-200"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted text-foreground/80">
                      Profile
                    </Link>
                    <Link href="/cart" className="block px-4 py-2 text-sm hover:bg-muted text-foreground/80">
                      <div className="flex items-center justify-between">
                        <span>Cart</span>
                        <ShoppingCart fontSize="small" className="text-primary" />
                      </div>
                    </Link>
                    <Link href="/orderList" className="block px-4 py-2 text-sm hover:bg-muted text-foreground/80">
                      Orders
                    </Link>
                    <div className="h-px bg-border my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2"
                    >
                      <Logout fontSize="small" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push('/signin')}
                  className="text-sm font-medium px-4 py-2 text-foreground/70 hover:text-primary transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-foreground/80 hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-foreground/80 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-4"></div>
            {userId ? (
              <div className="space-y-3">
                <Link href="/profile" className="flex items-center space-x-3 text-foreground/80" onClick={() => setMobileMenuOpen(false)}>
                  <Person className="text-primary" /> <span>Profile</span>
                </Link>
                <Link href="/cart" className="flex items-center space-x-3 text-foreground/80" onClick={() => setMobileMenuOpen(false)}>
                  <ShoppingCart className="text-secondary" /> <span>Cart</span>
                </Link>
                <Link href="/orderList" className="flex items-center space-x-3 text-foreground/80" onClick={() => setMobileMenuOpen(false)}>
                  <ShoppingBag className="text-blue-500" /> <span>Orders</span>
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center space-x-3 text-red-500">
                  <Logout /> <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => { router.push('/signin'); setMobileMenuOpen(false); }}
                  className="w-full py-3 border border-border rounded-xl font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={() => { router.push('/signup'); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
