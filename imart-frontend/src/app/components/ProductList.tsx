'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { useFetchProductsQuery } from '@/services/productsApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductList({ limit, hideHeader }: { limit?: number; hideHeader?: boolean }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState('rating');
  
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const { data: response, isLoading, error } = useFetchProductsQuery({
    search,
    sort,
  });

  const mockProducts = [
    {
      id: 'p-1',
      name: 'Cyberpunk Desk Lamp',
      price: 249.00,
      image_url: '/images/products/cyberpunk_lamp.png',
      store: { name: 'Neon Lights' },
      avg_rating: 4.9,
      is_wishlisted: false
    },
    {
      id: 'p-2',
      name: 'Titanium Mechanical Keyboard',
      price: 599.00,
      image_url: '/images/products/titanium_keyboard.png',
      store: { name: 'Iron Forge' },
      avg_rating: 5.0,
      is_wishlisted: true
    },
    {
      id: 'p-3',
      name: 'Neural Audio Headphones',
      price: 899.00,
      image_url: '/images/products/neural_headphones.png',
      store: { name: 'Sonic Labs' },
      avg_rating: 4.8,
      is_wishlisted: false
    },
    {
      id: 'p-4',
      name: 'Quantum Smartwatch',
      price: 349.00,
      image_url: '/images/products/quantum_watch.png',
      store: { name: 'Time Warp' },
      avg_rating: 4.7,
      is_wishlisted: false
    }
  ];

  const products = response?.data?.length ? response.data.slice(0, limit) : mockProducts;

  if (error && !products.length) return <div className="text-red-500 text-center py-10">Error loading products. Check your API server.</div>;

  return (
    <div className="space-y-12">
      {/* Header & Controls */}
      {!hideHeader && (
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between mb-24">
          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Premium Collection</h2>
            <h3 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[0.95] uppercase">
              {search ? `Results for` : 'The'} <br /> <span className="text-gray-800">{search ? `"${search}"` : 'Marketplace.'}</span>
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter these results..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[280px] backdrop-blur-sm"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 backdrop-blur-sm"
            >
              <option value="rating">Top Rated</option>
              <option value="az">Name: A-Z</option>
              <option value="za">Name: Z-A</option>
              <option value="low_high">Price: Low to High</option>
              <option value="high_low">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image_url={product.image_url}
                store_name={product.store?.name || 'iMart Shop'}
                avg_rating={product.avg_rating}
                is_wishlisted={product.is_wishlisted}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <ShoppingBag size={64} className="mb-4 opacity-10" />
          <p className="text-xl font-medium text-slate-400">No products found matching your search.</p>
          <button 
            onClick={() => setSearch('')}
            className="mt-4 text-blue-500 font-bold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

import { ShoppingBag } from 'lucide-react';
