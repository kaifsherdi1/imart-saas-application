'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(
        '.hero-tag',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5 }
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.5 },
        '-=1'
      )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2 },
        '-=1.2'
      )
      .fromTo(
        btnRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2 },
        '-=1'
      )
      .fromTo(
        '.hero-image',
        { opacity: 0, scale: 0.95, y: 150 },
        { opacity: 1, scale: 1, y: 0, duration: 2, ease: 'expo.out' },
        '-=1.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-48 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 blur-[180px] rounded-full" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="hero-tag mx-auto mb-10 flex w-fit items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2.5 text-[10px] font-black tracking-[0.3em] text-primary uppercase backdrop-blur-xl">
          <Sparkles size={14} className="text-primary animate-pulse" /> The Next-Gen SaaS Marketplace
        </div>

        <h1 ref={titleRef} className="mx-auto max-w-6xl text-6xl font-black leading-[0.95] tracking-[-0.04em] sm:text-8xl md:text-9xl lg:text-[10rem] mb-12 text-gradient uppercase">
          Elevating <br />
          <span className="text-white">Commerce.</span>
        </h1>

        <p ref={textRef} className="mx-auto max-w-2xl text-xl text-muted md:text-2xl mb-16 leading-relaxed font-medium">
          iMart is the ultimate multi-tenant platform for modern retailers. 
          Launch your store in seconds and reach customers worldwide.
        </p>

        <div ref={btnRef} className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-32">
          <Link 
            href="/login?register=owner"
            className="btn-industrial text-xl px-12 py-6 rounded-2xl"
          >
            Start Free Trial
            <ArrowRight size={24} />
          </Link>
          <Link 
            href="#explore"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-12 py-6 text-xl font-black text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20"
          >
            Explore Products
          </Link>
        </div>

        {/* Hero Image / Dashboard Mockup */}
        <div className="hero-image relative mx-auto max-w-6xl mt-20 group">
          <div className="absolute -inset-10 rounded-[60px] bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative rounded-[48px] border border-white/5 bg-card/40 p-4 backdrop-blur-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="rounded-[32px] object-cover transition-transform duration-1000 group-hover:scale-[1.01] w-full"
            >
              <source src="/videos/contact-bg.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

