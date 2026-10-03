'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  CreditCard,
  Shield
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { signOut } from '@/lib/auth';
import RequireRole from '../components/RequireRole';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={['owner', 'admin']}>
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await signOut(dispatch, token);
    router.replace('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Subscription', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Add Admin link if user is admin
  if (user?.role === 'admin') {
    navItems.unshift({ name: 'Admin Control', href: '/admin/stores', icon: Shield });
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            iMart<span className="text-blue-500">.</span>
          </Link>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav" 
                    className="ml-auto h-2 w-2 rounded-full bg-white" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 w-64 px-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-all hover:bg-red-900/20 hover:text-red-400">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-20 items-center justify-between border-b border-slate-800 px-8">
          <h2 className="text-xl font-semibold">Merchant Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white">
              <span className="sr-only">Notifications</span>
              {/* Add bell icon here if needed */}
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600" />
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
