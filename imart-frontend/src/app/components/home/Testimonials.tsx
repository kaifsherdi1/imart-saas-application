'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Owner at Aura Jewelry",
    content: "iMart transformed how we handle our multi-vendor operations. The speed and security are unmatched in the industry.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Amit",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Founder of Signal Tech",
    content: "The analytics dashboard alone is worth the subscription. We've seen a 40% increase in sales since moving to iMart.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rajesh",
    rating: 5,
  },
  {
    name: "Priya Das",
    role: "Merchant at Velvet Touch",
    content: "Seamless, fast, and beautiful. Our customers love the shopping experience, and we love the ease of management.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Success Stories</h2>
          <h3 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[0.95] uppercase">
            Loved by <br /> <span className="text-gray-800">merchants.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="testimonial-card group p-10 rounded-[40px] border border-white/5 bg-card/50 backdrop-blur-sm relative hover:bg-card transition-all duration-500 hover:border-primary/20"
            >
              <div className="absolute top-8 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote size={60} fill="currentColor" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-lg text-slate-300 italic mb-8 leading-relaxed relative z-10">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-white/10 overflow-hidden bg-white/5">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
