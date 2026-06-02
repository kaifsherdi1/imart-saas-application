'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ShieldCheck, Zap, Globe, BarChart3, Users } from 'lucide-react';

const features = [
  {
    title: "Global Reach",
    desc: "Sell to anyone, anywhere with localized payments and global currency support. Reach customers across borders seamlessly.",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Stripe Secured",
    desc: "Enterprise-grade subscription management and secure transactional integrity. Your business and customers are protected.",
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Redis Fast",
    desc: "Blazing fast performance with real-time analytics and intelligent caching. Experience zero-lag interactions.",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Advanced Analytics",
    desc: "Deep insights into your sales, customer behavior, and product performance. Data-driven growth at your fingertips.",
    icon: BarChart3,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Multi-tenant Arch",
    desc: "Robust isolation for every store. Manage thousands of vendors on a single, scalable infrastructure.",
    icon: Users,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Seamless UX",
    desc: "Smooth transitions and cinematic experiences. Retain customers with an interface they'll love to use.",
    icon: ShoppingBag,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-4xl space-y-6">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Platform Capabilities</h2>
            <h3 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[0.95] uppercase">
              Everything you <br /> <span className="text-gray-800">need to scale.</span>
            </h3>
          </div>
          <p className="max-w-md text-muted text-lg font-medium leading-relaxed uppercase tracking-tight">
            Powerful tools designed for the modern era of e-commerce. 
            Built for performance, security, and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card industrial-card group p-10"
            >
              <div className={`mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/5 text-primary transition-transform duration-500 group-hover:scale-110`}>
                <feature.icon size={32} />
              </div>
              <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">{feature.title}</h4>
              <p className="text-muted leading-relaxed group-hover:text-white transition-colors">
                {feature.desc}
              </p>
              
              <div className="absolute -bottom-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:-translate-x-4 group-hover:-translate-y-4">
                <feature.icon size={120} className="text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
