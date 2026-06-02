'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';

import { useFetchStoresQuery } from '@/services/storesApi';
import { getStoreImage } from '@/utils/imageMapper';

const mockStores = [
  {
    id: 'mock-1',
    name: 'Luxe Industrial',
    slug: 'luxe-industrial',
    business_type: 'Furniture',
    city: 'Milan',
    state: 'Italy',
    avg_rating: '4.9',
    products_count: 124,
    image: '/images/stores/luxe_industrial.png'
  },
  {
    id: 'mock-2',
    name: 'Chronos Watches',
    slug: 'chronos-watches',
    business_type: 'Accessories',
    city: 'Geneva',
    state: 'Switzerland',
    avg_rating: '5.0',
    products_count: 86,
    image: '/images/stores/chronos_watches.png'
  },
  {
    id: 'mock-3',
    name: 'Urban Tech',
    slug: 'urban-tech',
    business_type: 'Electronics',
    city: 'Tokyo',
    state: 'Japan',
    avg_rating: '4.8',
    products_count: 243,
    image: '/images/stores/urban_tech.png'
  }
];

export default function Stores() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: response, isLoading } = useFetchStoresQuery();
  
  const stores = response?.data?.length ? response.data.slice(0, 3) : mockStores;

  return (
    <section ref={sectionRef} className="py-48 bg-black relative min-h-[600px] z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Our Marketplace</h2>
            <h3 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[0.95] uppercase">
              Valuable <br /> <span className="text-gray-800">Stores.</span>
            </h3>
          </div>
          <Link href="/shops" className="group flex items-center gap-3 text-sm font-black text-muted hover:text-white transition-all uppercase tracking-widest">
            View All Stores <span className="transition-transform group-hover:translate-x-2 text-primary">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {stores.map((store: any, i: number) => (
            <Link 
              key={store.id} 
              href={`/store/${store.slug}`}
              className="store-card industrial-card group relative block overflow-hidden opacity-100 translate-y-0 transition-all duration-700"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="relative h-[450px] w-full overflow-hidden">
                <Image 
                  src={getStoreImage(store.name, store.business_type, store.image)} 
                  alt={store.name} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-8 left-8 flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 text-[10px] font-black text-white backdrop-blur-xl border border-white/10 uppercase tracking-widest">
                  {store.business_type}
                </div>
              </div>
              
              <div className="p-10 -mt-24 relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-3xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">{store.name}</h4>
                    <div className="flex items-center gap-3 text-muted text-sm font-bold uppercase tracking-wider">
                      <MapPin size={14} className="text-primary" />
                      {store.city}, {store.state}
                    </div>
                  </div>
                  <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
                
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-primary fill-primary" />
                    <span className="text-sm font-black text-white">{store.avg_rating}</span>
                  </div>
                  <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{store.products_count} Items</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

