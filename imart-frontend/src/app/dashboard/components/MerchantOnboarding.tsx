'use client';

import React from 'react';
import { CheckCircle2, Circle, Store, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ChecklistProps {
  stats: any; // Ideally we pass the count of products and subscription status
}

export default function MerchantOnboarding({ stats }: ChecklistProps) {
  const steps = [
    { 
      id: 'store', 
      label: 'Store Approved', 
      desc: 'Get your business verified by admins.', 
      isDone: true, // If they are in the dashboard, they are approved
      icon: Store,
      link: '#'
    },
    { 
      id: 'products', 
      label: 'Add Products', 
      desc: 'List your first item for the marketplace.', 
      isDone: (stats?.total_products || 0) > 0,
      icon: ShoppingBag,
      link: '/dashboard/products'
    },
    { 
      id: 'billing', 
      label: 'Setup Billing', 
      desc: 'Subscribe to a plan to start selling.', 
      isDone: stats?.is_subscribed || false,
      icon: CreditCard,
      link: '/dashboard/billing'
    }
  ];

  const completedCount = steps.filter(s => s.isDone).length;
  const progressPercent = (completedCount / steps.length) * 100;

  if (progressPercent === 100) return null; // Hide if fully onboarded

  return (
    <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white">Getting Started</h3>
          <p className="text-sm text-blue-200/60">Complete these steps to launch your store.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-blue-400">{Math.round(progressPercent)}%</span>
        </div>
      </div>

      <div className="h-2 w-full bg-slate-900 rounded-full mb-8 overflow-hidden border border-white/5">
        <div 
          className="h-full bg-blue-500 transition-all duration-1000" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <Link 
            key={step.id} 
            href={step.link}
            className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
              step.isDone ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-900 border-blue-500/30 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${step.isDone ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                {step.isDone ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
              </div>
              <div>
                <p className={`font-bold ${step.isDone ? 'text-slate-500 line-through' : 'text-white'}`}>{step.label}</p>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            </div>
            {!step.isDone && <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />}
          </Link>
        ))}
      </div>
    </div>
  );
}
