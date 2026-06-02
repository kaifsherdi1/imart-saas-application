'use client';

import React from 'react';
import { useFetchWishlistQuery } from '@/services/productsApi';
import { getProductImage } from '@/utils/imageMapper';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LikedProductsPage() {
  const { data: wishlistResponse, isLoading, error } = useFetchWishlistQuery();
  const products = wishlistResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-xl text-rose-500 font-bold">Failed to load wishlist.</p>
        <p className="text-slate-400 mt-2">Please ensure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Heart className="fill-rose-500 text-rose-500" size={32} />
          My Wishlist
        </h1>
        <p className="mt-2 text-slate-400">Products you have liked and saved for later.</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[32px] border border-white/5 bg-slate-900/50 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-slate-600 mb-6">
            <Heart size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            You haven't liked any products yet. Browse the marketplace and tap the heart icon on products you love!
          </p>
          <Link 
            href="/shops" 
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]"
          >
            <ShoppingBag size={20} />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/5 bg-slate-900/50 transition-all hover:border-white/10 hover:bg-slate-800/50"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-950">
                {product.image_url ? (
                  <img 
                    src={getProductImage(product.name, product.category, product.image_url)} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-700">No Image</div>
                )}
                
                {/* Absolute Heart Icon */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-500/50 text-rose-500">
                  <Heart size={20} className="fill-rose-500" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">
                  {product.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{product.description || 'No description available.'}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-black text-white">₹{product.price}</span>
                  <Link 
                    href={`/products/${product.id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-blue-600 hover:scale-110"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
