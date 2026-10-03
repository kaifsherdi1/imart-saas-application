'use client';

import React, { useState, useCallback } from 'react';
import { API_URL } from '@/lib/config';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/slices/authSlice';
import { homeForRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'Login successful.',
          background: '#111217',
          color: '#fff',
          confirmButtonColor: '#3B82F6',
          customClass: {
            popup: 'rounded-[32px] border border-white/5',
          }
        });
        router.push(homeForRole(result.data.user.role));
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Auth Error',
        text: err.message,
        background: '#111217',
        color: '#fff',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  }, [identifier, password, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden mt-16">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full" />

      {/* <Link href="/" className="absolute top-12 left-12 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back to home
      </Link> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-10 rounded-[40px] border border-white/5 bg-card/50 p-10 md:p-12 shadow-2xl backdrop-blur-2xl relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary text-white text-2xl font-black italic shadow-xl shadow-primary/20">
            i
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Access your enterprise dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email or Mobile Number</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-all"
                  placeholder="admin@imart.com or 9876543210"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-12 text-white focus:border-primary/50 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-5 text-lg font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to iMart'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-slate-500 text-sm font-medium">
            Don't have an account? <Link href="/register-store" className="text-primary font-bold hover:underline">Start selling</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

