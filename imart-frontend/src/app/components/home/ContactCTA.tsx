'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';

export default function ContactCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 1,
        ease: 'power4.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="cta-content relative rounded-[60px] bg-gradient-to-br from-primary/80 to-accent p-12 md:p-24 text-center overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-black/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              Ready to revolutionize your shop?
            </h2>
            <p className="text-blue-50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed opacity-90">
              Join 10,000+ successful merchants who are scaling their businesses with iMart. Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link 
                href="/login?register=owner" 
                className="w-full sm:w-auto rounded-2xl bg-white px-10 py-5 text-lg font-black text-primary transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                Get Started Now
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-10 py-5 text-lg font-black text-white backdrop-blur-md transition-all hover:bg-white/10"
              >
                <Mail size={20} />
                Contact Sales
              </Link>
            </div>
            
            <p className="text-white/60 text-sm font-bold uppercase tracking-widest pt-8">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
