'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/slices/authSlice';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Store,
  LogOut,
  Heart,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}#explore`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shops', href: '/shops' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled ? "py-4" : "py-6"
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500",
            scrolled ? "glass-morphism shadow-2xl" : "bg-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white overflow-hidden">
              <span className="relative z-10 font-black text-xl">i</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              iMart<span className="text-primary not-italic">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">

            {/* Search Trigger (Mobile/Compact) */}
            <button className="p-2 text-muted hover:text-white transition-colors">
              <Search size={18} />
            </button>

            <Link href="/cart" className="relative p-2 text-muted hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={user.role === 'customer' ? '/account' : '/dashboard'}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-all hover:bg-white/10"
                >
                  <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-[10px] font-black text-white">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden text-[10px] font-black uppercase tracking-widest text-white sm:block">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block p-2 text-muted hover:text-primary transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/login?register=owner"
                  className="hidden sm:block btn-industrial text-[10px] py-2 px-6 rounded-xl"
                >
                  Start Selling
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white lg:hidden bg-white/5 rounded-xl border border-white/10"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[-1] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-card border-l border-white/5 p-8 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <span className="text-xl font-black italic">iMart.</span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400">
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex flex-col gap-6 mb-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "text-lg font-bold transition-colors",
                        pathname === link.href ? "text-primary" : "text-white"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold text-white"
                  >
                    My Cart
                  </Link>
                </nav>

                <div className="pt-8 border-t border-white/5">
                  {!user && (
                    <Link
                      href="/login?register=owner"
                      className="flex w-full justify-center rounded-xl bg-primary py-4 text-sm font-bold text-white"
                    >
                      Start Selling
                    </Link>
                  )}
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-4 text-sm font-bold text-red-500"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

