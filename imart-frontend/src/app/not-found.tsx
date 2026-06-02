'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      {/* Animated background element */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-8"
      >
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-blue-500 shadow-2xl">
          <Compass size={64} className="animate-spin-slow" />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-black tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-slate-400">Lost in the Marketplace</h2>
          <p className="mx-auto max-w-md text-slate-500">
            The page you are looking for doesn't exist or has been moved to a different store.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:bg-slate-900"
          >
            <ArrowLeft size={20} />
            Previous Page
          </button>
        </div>
      </motion.div>
    </div>
  );
}
