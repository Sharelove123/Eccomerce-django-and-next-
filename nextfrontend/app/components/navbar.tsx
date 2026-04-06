'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { resetAuthCookies } from '../lib/actions';
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout,
  ShoppingBag,
  Forum,
} from '@mui/icons-material';
import Link from 'next/link';
import apiService from '../services/apiService';
import { VendorStatus } from '../utils/types';

interface Props {
  userId: string | null;
}

export default function PrimarySearchAppBar({ userId }: Props) {
  const router = useRouter();
  const [cartCount, setCartCount] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [vendorStatus, setVendorStatus] = React.useState<VendorStatus | null>(null);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cart.reduce((acc: number, item: { quantity?: number }) => acc + (Number(item.quantity) || 0), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  React.useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartChange', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartChange', updateCartCount);
    };
  }, []);

  React.useEffect(() => {
    if (!userId) {
      setVendorStatus(null);
      return;
    }

    const fetchVendorStatus = async () => {
      try {
        const response = await apiService.get('/api/vendor/status/');
        if (response && typeof response.is_vendor === 'boolean') {
          setVendorStatus(response);
          return;
        }
      } catch {
        // keep null
      }

      setVendorStatus(null);
    };

    fetchVendorStatus();
  }, [userId]);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
    { name: 'Products', href: '/categories/?name=All' },
    { name: 'Contact', href: '/contactus' },
  ];

  const messagesHref = vendorStatus?.is_vendor ? '/vendor/chats' : '/messages';

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`mx-auto max-w-7xl rounded-[1.75rem] border transition-all duration-300 ${
          isScrolled
            ? 'border-[rgba(216,204,187,0.9)] bg-[rgba(255,252,247,0.82)] shadow-[0_18px_50px_rgba(15,23,42,0.09)] backdrop-blur-xl'
            : 'border-[rgba(255,255,255,0.18)] bg-[linear-gradient(135deg,rgba(20,26,34,0.88),rgba(52,39,25,0.62))] shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-5 sm:px-7">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 text-left"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isScrolled ? 'border-black/10 bg-white text-slate-900' : 'border-white/15 bg-white/10 text-white'}`}>
              <ShoppingBag fontSize="small" />
            </div>
            <div>
              <p className={`eyebrow ${isScrolled ? 'text-slate-500' : 'text-white/60'}`}>Curated goods</p>
              <p className={`text-xl font-semibold tracking-[0.08em] ${isScrolled ? 'text-slate-950' : 'text-white'}`}>ECCOMERCE</p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold tracking-[0.14em] uppercase transition-colors ${
                  isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/78 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cart"
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                isScrolled ? 'border-black/10 bg-white text-slate-900 hover:bg-slate-50' : 'border-white/15 bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <ShoppingCart fontSize="small" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {userId ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((current) => !current)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 transition ${
                    isScrolled ? 'border-black/10 bg-white text-slate-900 hover:bg-slate-50' : 'border-white/15 bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${isScrolled ? 'bg-[rgba(184,131,71,0.14)] text-[var(--secondary)]' : 'bg-white/15 text-white'}`}>
                    <Person fontSize="small" />
                  </span>
                  <span className="text-sm font-semibold tracking-[0.12em] uppercase">Account</span>
                </button>

                {userMenuOpen && (
                  <div
                    className="premium-panel absolute right-0 mt-3 w-60 rounded-[1.5rem] p-2 text-sm text-slate-700"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <Link href="/profile" className="block rounded-xl px-4 py-3 hover:bg-black/[0.04]">Profile</Link>
                    <Link href="/cart" className="block rounded-xl px-4 py-3 hover:bg-black/[0.04]">Cart</Link>
                    <Link href="/orderList" className="block rounded-xl px-4 py-3 hover:bg-black/[0.04]">Orders</Link>
                    <Link href={messagesHref} className="block rounded-xl px-4 py-3 hover:bg-black/[0.04]">
                      {vendorStatus?.is_vendor ? 'Vendor Chats' : 'Messages'}
                    </Link>
                    <Link
                      href={vendorStatus?.is_vendor ? '/vendor/dashboard' : '/vendor/register'}
                      className="block rounded-xl px-4 py-3 hover:bg-black/[0.04]"
                    >
                      {vendorStatus?.is_vendor ? 'Vendor Dashboard' : 'Become a Seller'}
                    </Link>
                    <div className="my-2 h-px bg-black/8" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <Logout fontSize="small" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold tracking-[0.12em] uppercase ${
                    isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/78 hover:text-white'
                  }`}
                >
                  Log In
                </Link>
                <Link href="/signup" className="premium-button rounded-full px-5 py-2.5 text-sm font-semibold tracking-[0.12em] uppercase">
                  Join Now
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/cart"
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border ${
                isScrolled ? 'border-black/10 bg-white text-slate-900' : 'border-white/15 bg-white/10 text-white'
              }`}
            >
              <ShoppingCart fontSize="small" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen((current) => !current)}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                isScrolled ? 'border-black/10 bg-white text-slate-900' : 'border-white/15 bg-white/10 text-white'
              }`}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl px-1 md:hidden">
          <div className="premium-panel rounded-[1.75rem] p-5">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold tracking-[0.12em] uppercase text-slate-700 hover:bg-black/[0.04]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="my-4 h-px bg-black/10" />
            {userId ? (
              <div className="space-y-2">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-black/[0.04]">
                  <Person fontSize="small" /> <span>Profile</span>
                </Link>
                <Link href="/orderList" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-black/[0.04]">
                  <ShoppingBag fontSize="small" /> <span>Orders</span>
                </Link>
                <Link href={messagesHref} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-black/[0.04]">
                  <Forum fontSize="small" /> <span>{vendorStatus?.is_vendor ? 'Vendor Chats' : 'Messages'}</span>
                </Link>
                <Link
                  href={vendorStatus?.is_vendor ? '/vendor/dashboard' : '/vendor/register'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-black/[0.04]"
                >
                  <ShoppingBag fontSize="small" />
                  <span>{vendorStatus?.is_vendor ? 'Vendor Dashboard' : 'Become a Seller'}</span>
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50">
                  <Logout fontSize="small" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="premium-outline rounded-full px-5 py-3 text-center text-sm font-semibold tracking-[0.12em] uppercase">
                  Log In
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="premium-button rounded-full px-5 py-3 text-center text-sm font-semibold tracking-[0.12em] uppercase">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
