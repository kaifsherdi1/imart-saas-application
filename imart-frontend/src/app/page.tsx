'use client';

import React from 'react';
import Hero from './components/home/Hero';
import Categories from './components/home/Categories';
import Stores from './components/home/Stores';
import WhyChooseUs from './components/home/WhyChooseUs';
import Testimonials from './components/home/Testimonials';
import Team from './components/home/Team';
import ContactCTA from './components/home/ContactCTA';
import Footer from './components/Footer';
import ProductList from './components/ProductList';


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Hero />
      <Stores />
      
      {/* Top Rated Products Section */}
      <section id="explore" className="py-32 bg-background relative">
        <div className="container mx-auto px-6 mb-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Curated Marketplace</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">Top Rating Products</h3>
            <p className="text-slate-400">Discover the highest-rated products from our most trusted partner stores.</p>
          </div>
        </div>
        <div className="container mx-auto px-6">
          <ProductList hideHeader limit={8} />
        </div>
      </section>

      <Categories />
      <WhyChooseUs />
      <Testimonials />
      <Team />
      <ContactCTA />
      <Footer />
    </div>
  );
}

