'use client';

import React, { useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-hero-text', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'expo.out'
      });
      gsap.from('.contact-form-item', {
        opacity: 0,
        x: 40,
        duration: 1,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power3.out'
      });
      gsap.from('.contact-footer-item', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.2,
        delay: 1,
        ease: 'power2.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-black overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/contact-bg.png"
          alt="Contact Background"
          fill
          className="object-cover opacity-60 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left Column: Big Heading */}
          <div className="contact-hero-text">
            <h1 className="text-5xl md:text-[8rem] xl:text-[10rem] font-black text-[#F5F5F5] tracking-tighter leading-[0.85] uppercase flex flex-col">
              <span>Scale</span>
              <span>Better</span>
              <span className="text-white/10 italic">With Us.</span>
            </h1>
          </div>

          {/* Right Column: Minimal Form */}
          <div className="max-w-xl w-full ml-auto">
            <form className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="contact-form-item space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">First name*</label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:border-primary focus:outline-none transition-all text-lg font-medium"
                  />
                </div>

                <div className="contact-form-item space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Last name*</label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:border-primary focus:outline-none transition-all text-lg font-medium"
                  />
                </div>
              </div>

              <div className="contact-form-item space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Email*</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:border-primary focus:outline-none transition-all text-lg font-medium"
                />
              </div>

              <div className="contact-form-item space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Description</label>
                <textarea
                  rows={2}
                  className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:border-primary focus:outline-none transition-all text-lg font-medium resize-none"
                />
              </div>

              <div className="contact-form-item pt-6">
                <button className="group flex items-center gap-8 text-sm font-black text-white hover:text-primary transition-all uppercase tracking-[0.3em]">
                  Send Message
                  <div className="h-16 w-16 rounded-full border border-white/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500">
                    <ArrowRight size={24} />
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-48 pt-20 border-t border-white/5">
          <div className="contact-footer-item space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Visit us</h4>
            <p className="text-2xl font-black text-white uppercase tracking-tight">123 Tech Plaza <br /> San Francisco, CA</p>
          </div>
          <div className="contact-footer-item space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Get in touch</h4>
            <p className="text-2xl font-black text-white uppercase tracking-tight">hello@imart.com <br /> +1 (555) 123-4567</p>
          </div>
          <div className="contact-footer-item space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Need Help?</h4>
            <p className="text-2xl font-black text-white uppercase tracking-tight">Support center <br /> FAQ & Guides</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
