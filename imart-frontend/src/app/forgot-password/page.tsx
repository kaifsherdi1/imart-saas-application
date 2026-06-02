'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // Steps: 1 = Request OTP, 2 = Verify OTP, 3 = Reset Password
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: `Your OTP is: ${data.otp} (Simulated for testing)`,
          background: '#111217',
          color: '#fff',
          confirmButtonColor: '#3B82F6',
        });
        setStep(2);
        setTimeLeft(60);
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#111217', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(3);
      } else {
        throw new Error(data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#111217', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match.', background: '#111217', color: '#fff' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, password, password_confirmation: passwordConfirmation }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your password has been reset successfully. Please login.',
          background: '#111217',
          color: '#fff',
          confirmButtonColor: '#3B82F6',
        }).then(() => {
          router.push('/login');
        });
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#111217', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full" />

      <Link href="/login" className="absolute top-12 left-12 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-10">
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back to Login
      </Link>

      <div className="w-full max-w-md space-y-10 rounded-[40px] border border-white/5 bg-card/50 p-10 md:p-12 shadow-2xl backdrop-blur-2xl relative z-10 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="text-center space-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary/20 text-primary shadow-xl">
                  <Mail size={28} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">Forgot Password</h1>
                <p className="text-slate-500 font-medium">Enter your email or phone number to receive a 4-digit OTP.</p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email or Mobile</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-all"
                      placeholder="e.g. admin@imart.com or 9876543210"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary py-5 text-lg font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="text-center space-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-amber-500/20 text-amber-500 shadow-xl">
                  <KeyRound size={28} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">Verify OTP</h1>
                <p className="text-slate-500 font-medium">Enter the 4-digit code sent to your device.</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">4-Digit OTP</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-center text-2xl tracking-[0.5em] text-white focus:border-amber-500/50 focus:outline-none transition-all"
                      placeholder="••••"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading || otp.length !== 4} className="w-full rounded-2xl bg-amber-500 py-5 text-lg font-black text-white shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>

              <div className="text-center mt-4">
                {timeLeft > 0 ? (
                  <p className="text-slate-500 text-sm font-medium">
                    OTP expires in <span className="text-amber-500 font-bold">{timeLeft}s</span>
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm font-medium">
                    Didn't receive code?{' '}
                    <button 
                      onClick={handleRequestOtp} 
                      disabled={loading}
                      className="text-amber-500 font-bold hover:underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="text-center space-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-emerald-500/20 text-emerald-500 shadow-xl">
                  <Lock size={28} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">New Password</h1>
                <p className="text-slate-500 font-medium">Create a strong new password.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-12 text-white focus:border-emerald-500/50 focus:outline-none transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors focus:outline-none">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-12 text-white focus:border-emerald-500/50 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full rounded-2xl bg-emerald-500 py-5 text-lg font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
