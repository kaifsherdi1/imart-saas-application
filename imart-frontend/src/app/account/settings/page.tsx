'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials } from '@/slices/authSlice';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProfileSettings() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.status === 'success') {
        dispatch(setCredentials({ user: data.data, token: token! }));
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your personal details have been saved.',
          background: '#0f172a',
          color: '#fff',
        });
        setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message,
        background: '#0f172a',
        color: '#fff',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12 space-y-2">
        <h1 className="text-4xl font-black">Personal Settings</h1>
        <p className="text-slate-500 text-lg">Manage your identity and account security.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 p-8 text-center text-white shadow-2xl">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 backdrop-blur-md">
              <User size={48} />
            </div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-blue-100 text-sm opacity-80">{user?.email}</p>
            <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} /> Verified {user?.role}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-10 backdrop-blur-xl">
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-800">
              <h4 className="font-bold text-slate-400">Change Password (Leave blank to keep current)</h4>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={20} />
                {isLoading ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
