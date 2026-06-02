'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { Store, Star, MapPin, Search, Filter, ArrowUpRight } from 'lucide-react';
import Footer from '../components/Footer';

import { useFetchStoresQuery } from '@/services/storesApi';
import { getStoreImage } from '@/utils/imageMapper';

export default function ShopsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: response, isLoading, error } = useFetchStoresQuery();
  const stores = response?.data || [];

  useEffect(() => {
    if (stores.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from('.shop-card', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [stores]);

  const filteredStores = stores.filter((store: any) => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.business_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Stores...</div>;

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-black pt-32">
      <div className="container mx-auto px-6 pb-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Our Merchants</h2>
            <h1 className="text-5xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              The <br /> <span className="text-gray-800 italic">Marketplace.</span>
            </h1>
          </div>
          
          <div className="w-full md:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search stores or categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-all uppercase text-xs font-black tracking-widest"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
          {['All', 'Jewelry', 'Electronics', 'Fashion', 'Grocery', 'Furniture', 'Sports'].map((cat) => (
            <button 
              key={cat}
              className="whitespace-nowrap px-8 py-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black text-slate-400 hover:text-white hover:border-primary/30 transition-all uppercase tracking-widest"
            >
              {cat}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-2 px-8 py-3 rounded-xl border border-primary/20 bg-primary/5 text-[10px] font-black text-primary uppercase tracking-widest">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredStores.map((store: any) => (
            <Link 
              key={store.id} 
              href={`/store/${store.slug}`}
              className="shop-card industrial-card group relative block"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image 
                  src={getStoreImage(store.name, store.business_type, store.image)} 
                  alt={store.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute top-6 left-6 flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 text-[10px] font-black text-white backdrop-blur-md uppercase tracking-wider border border-white/10">
                  {store.business_type}
                </div>
              </div>
              
              <div className="p-10 -mt-12 relative z-10">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-black border border-white/10 shadow-2xl group-hover:border-primary/50 transition-colors">
                  <Store size={32} className="text-primary" />
                </div>

                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-3xl font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{store.name}</h4>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    {store.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-primary fill-primary" />
                    {store.avg_rating}
                  </div>
                </div>
                
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Inventory</span>
                    <span className="text-xl font-black text-white uppercase">{store.products_count} Items</span>
                  </div>
                  <span className="rounded-xl bg-primary/10 px-6 py-3 text-[10px] font-black text-primary group-hover:bg-primary group-hover:text-white transition-all uppercase tracking-widest">
                    Visit Store
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="py-40 text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-slate-600 mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white">No stores found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
