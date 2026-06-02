'use client';

import Link from 'next/link';
import { Globe, MessageCircle, Users, Image as ImageIcon } from 'lucide-react';


export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { name: 'All Products', href: '/products' },
      { name: 'Categories', href: '/categories' },
      { name: 'Shops', href: '/shops' },
      { name: 'Sell on iMart', href: '/login?register=owner' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-white/5 bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="text-3xl font-black tracking-tighter">
              iMart<span className="text-primary">.</span>
            </Link>
            <p className="max-w-xs text-slate-400 leading-relaxed text-sm">
              The world's most advanced multi-tenant SaaS marketplace for modern creators and entrepreneurs. Scale your business with enterprise-grade tools.
            </p>
            <div className="flex items-center gap-4">
              {[MessageCircle, Globe, Users, ImageIcon].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all text-slate-400 hover:text-primary"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>

          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600 text-xs font-medium">
          <p>© {currentYear} iMart SaaS Platform. Built with precision and passion.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
