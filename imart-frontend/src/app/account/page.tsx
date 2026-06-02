'use client';

import React from 'react';
import { useFetchOrdersQuery, useFetchWishlistQuery } from '@/services/productsApi';
import { getProductImage } from '@/utils/imageMapper';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Package, Calendar, ChevronRight, Banknote } from 'lucide-react';
import Link from 'next/link';

export default function CustomerProfilePage() {
  const { data: ordersData, isLoading: ordersLoading } = useFetchOrdersQuery();
  const { data: wishlistData, isLoading: wishlistLoading } = useFetchWishlistQuery();

  const orders = ordersData?.data?.data || [];
  const wishlist = wishlistData?.data || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">My Account</h1>
          <p className="mt-2 text-slate-400">Manage your orders and saved products.</p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Order History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <Package className="text-blue-500" />
              <h2 className="text-2xl font-bold">Order History</h2>
            </div>

            <div className="space-y-4">
              {ordersLoading ? (
                [1, 2].map(i => <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-slate-900 border border-slate-800" />)
              ) : orders.map((order: any) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-900"
                >
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">₹{order.total_amount}</p>
                    <Link href={`/orders/${order.id}`} className="text-xs font-bold text-blue-500 hover:underline">View Details</Link>
                  </div>
                </motion.div>
              ))}
              
              {orders.length === 0 && !ordersLoading && (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                  You haven't placed any orders yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Wallet Section */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)]">
              <div className="flex items-center gap-3 mb-4">
                <Banknote className="text-amber-500" />
                <h2 className="text-xl font-bold text-amber-500">iMart EMI Wallet</h2>
              </div>
              <p className="text-sm text-slate-300 mb-4">Get up to ₹5,00,000 instant credit at a flat 5% interest rate.</p>
              <Link href="/account/emi" className="block w-full rounded-xl bg-amber-500 text-slate-950 text-center py-3 font-bold hover:bg-amber-400 transition-colors">
                Apply / View Balance
              </Link>
            </div>

            {/* Wishlist Sidebar */}
            <div className="flex items-center gap-3">
              <Heart className="text-red-500" />
              <h2 className="text-2xl font-bold">Wishlist</h2>
            </div>
            <Link href="/account/liked" className="text-sm font-bold text-red-500 hover:underline inline-block mb-2">View Full Wishlist &rarr;</Link>

            <div className="space-y-4">
              {wishlistLoading ? (
                [1, 2].map(i => <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-slate-900 border border-slate-800" />)
              ) : wishlist.map((product: any) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-red-500/30 hover:bg-slate-900"
                >
                  <img src={getProductImage(product.name, undefined, product.image_url)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{product.name}</p>
                    <p className="text-sm text-slate-500">₹{product.price}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-700" />
                </Link>
              ))}

              {wishlist.length === 0 && !wishlistLoading && (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
                  Your wishlist is empty.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
