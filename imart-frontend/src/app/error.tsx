'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('System Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle size={48} />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black">Something went wrong</h1>
          <p className="mx-auto max-w-md text-slate-400">
            A system error occurred. Our engineers have been notified. 
            You can try refreshing the page or return to safety.
          </p>
          <div className="mx-auto mt-4 w-fit rounded-lg bg-red-500/5 px-4 py-2 font-mono text-xs text-red-400 border border-red-500/10">
            Error ID: {error.digest || 'Internal-System-Failure'}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 rounded-2xl bg-red-600 px-8 py-4 font-bold text-white transition-all hover:bg-red-700"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:bg-slate-900"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
