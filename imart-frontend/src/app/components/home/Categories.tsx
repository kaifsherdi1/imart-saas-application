'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shirt, Smartphone, Sparkles, Gem, ShoppingCart, Home, Trophy } from 'lucide-react';

const categories = [
  { name: 'Jewelry', icon: Gem, image: '/images/stores/luxe_jewelry.png', subtitle: 'Luxe Jewelry & Gold' },
  { name: 'Electronics', icon: Smartphone, image: '/images/stores/urban_tech.png', subtitle: 'Next-Gen Technology' },
  { name: 'Fashion', icon: Shirt, image: '/images/stores/velvet_fashion.png', subtitle: 'Designer Apparel & Garms' },
  { name: 'Grocery', icon: ShoppingCart, image: '/images/stores/local_pantry.png', subtitle: 'Artisanal Pantry & Goods' },
  { name: 'Furniture', icon: Home, image: '/images/stores/luxe_industrial.png', subtitle: 'Minimalist & Modern Living' },
  { name: 'Sports', icon: Trophy, image: '/images/stores/profit_sports.png', subtitle: 'Professional Athletic Gear' },
];

export default function Categories() {
  return (
    <section className="py-48 bg-[#F5F5F5] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Curated Collections</h2>
            <h3 className="text-5xl md:text-8xl font-black tracking-tight text-black leading-[0.95] uppercase">
              Explore <br /> <span className="text-gray-400">The Goods.</span>
            </h3>
          </div>
          <Link href="/categories" className="group flex items-center gap-3 text-sm font-black text-gray-500 hover:text-black transition-all uppercase tracking-widest">
            View All Categories <span className="transition-transform group-hover:translate-x-2 text-primary">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={`/products?category=${cat.name.toLowerCase()}`}
              className="category-card group relative h-80 overflow-hidden rounded-[32px] border border-black/5 shadow-sm transition-all duration-700 hover:shadow-2xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={cat.image} 
                  alt={cat.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
              </div>

              {/* Floating Icon Badge */}
              <div className="absolute top-8 left-8 z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all duration-700 group-hover:bg-primary group-hover:scale-110 group-hover:border-primary/50">
                <cat.icon size={20} />
              </div>

              <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <Sparkles size={20} className="text-primary animate-pulse" />
              </div>
              
              {/* Text Content */}
              <div className="absolute inset-x-8 bottom-8 z-10 flex flex-col">
                <h4 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors duration-500">{cat.name}</h4>
                <p className="mt-1 text-xs text-slate-300 font-bold uppercase tracking-[0.2em]">{cat.subtitle}</p>
                <div className="mt-6 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

