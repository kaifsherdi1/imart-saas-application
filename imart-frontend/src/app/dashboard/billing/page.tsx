'use client';

import React from 'react';
import { useFetchPlansQuery, useCreateCheckoutSessionMutation } from '@/services/productsApi';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';

export default function BillingPage() {
  const { data: plansResponse, isLoading } = useFetchPlansQuery();
  const [createSession, { isLoading: isRedirecting }] = useCreateCheckoutSessionMutation();
  const plans = plansResponse?.data || [];

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await createSession(planId).unwrap();
      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Error',
        text: err.data?.message || 'Could not initiate Stripe checkout.',
        background: '#0f172a',
        color: '#fff',
      });
    }
  };

  const planIcons: any = {
    Monthly: Zap,
    Yearly: Shield,
    'Two-Year': Crown,
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Subscription Plans</h1>
        <p className="mt-4 text-lg text-slate-400">Scale your business with iMart premium features.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-96 w-full animate-pulse rounded-3xl bg-slate-900 border border-slate-800" />)
        ) : plans.map((plan: any, index: number) => {
          const Icon = planIcons[plan.name] || Zap;
          const isBestValue = plan.name === 'Yearly';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:scale-105 ${
                isBestValue 
                ? 'border-blue-500 bg-blue-600/5 ring-2 ring-blue-500/20' 
                : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              {isBestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Best Value
                </div>
              )}

              <div className="mb-8">
                <div className={`mb-4 inline-flex rounded-2xl p-3 ${isBestValue ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹{Math.floor(plan.price)}</span>
                  <span className="text-slate-400">/{plan.duration_days} days</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {[
                  'Unlimited Product Listings',
                  'Advanced Analytics Dashboard',
                  'Priority Support',
                  'Custom Store URL',
                  'Excel Bulk Import/Export',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <Check size={18} className="text-blue-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isRedirecting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold transition-all ${
                  isBestValue 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                <CreditCard size={20} />
                {isRedirecting ? 'Processing...' : 'Subscribe Now'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-8 text-center">
        <p className="text-slate-400">
          All plans include a 30-day free trial on initial approval. 
          Secured by <strong>Stripe</strong>. No hidden fees.
        </p>
      </div>
    </div>
  );
}
