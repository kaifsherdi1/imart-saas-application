'use client';

import React, { useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Team from '../components/home/Team';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.from('.about-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-black pt-20">
      
      {/* About Hero */}
      <section className="py-48 relative overflow-hidden bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="about-content space-y-8">
            <h1 className="text-5xl md:text-[10rem] font-black tracking-tighter text-white uppercase leading-[0.85]">
              Modern <br /> 
              <span className="text-primary">Retailing.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-2xl text-muted leading-relaxed font-medium">
              Founded in 2026, iMart was built with a single mission: to empower every retailer with the tools they need to succeed in a digital-first world.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 border-y border-white/5 bg-[#F5F5F5]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Active Sellers', value: '10k+' },
              { label: 'Total Products', value: '250k+' },
              { label: 'Countries', value: '45+' },
              { label: 'Transactions', value: '$2B+' },
            ].map((stat, i) => (
              <div key={i} className="about-content space-y-4">
                <h4 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter">{stat.value}</h4>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      
      <section className="py-48 bg-black">
        <div className="container mx-auto px-6">
           <div className="max-w-4xl mx-auto text-center space-y-12">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Our Philosophy</h2>
              <p className="text-3xl md:text-5xl font-bold text-white leading-tight uppercase tracking-tight">
                "We believe that every shop owner deserves the same digital capabilities as the world's largest retailers."
              </p>
              <div className="h-24 w-[2px] bg-primary mx-auto" />
           </div>
        </div>
      </section>

      <Team />
      
      <Footer />
    </div>
  );
}
