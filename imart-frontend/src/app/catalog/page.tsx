'use client';

import React, { Suspense } from 'react';
import ProductList from '../components/ProductList';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-black pt-32">
      <div className="container mx-auto px-6 py-20">
        <div className="mb-24 space-y-6">
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Inventory</h2>
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85]">
            The <br /> <span className="text-muted">Catalog.</span>
          </h1>
        </div>
        
        <div className="industrial-card p-1 bg-white/5 border-white/10">
           <div className="bg-black p-12 rounded-2xl">
              <Suspense fallback={null}>
                <ProductList />
              </Suspense>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
