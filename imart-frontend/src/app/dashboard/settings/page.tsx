'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/slices/authSlice';
import { RootState } from '@/store';
import { useUpdateStoreMutation } from '@/services/productsApi';
import { motion } from 'framer-motion';
import { Save, Store, Globe, MapPin, Tag } from 'lucide-react';
import Swal from 'sweetalert2';

export default function StoreSettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const store = user?.store;
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const [formData, setFormData] = useState({
    name: store?.name || '',
    slug: store?.slug || '',
    address: store?.address || '',
    category: store?.category || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateStore(formData).unwrap();
      if (user) dispatch(setUser({ ...user, store: res.data }));
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your store profile has been updated.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.data?.message || 'Check your fields and try again.',
        background: '#0f172a',
        color: '#fff',
      });
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-slate-400">Update your public shop profile and business information.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Store size={16} /> Shop Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Globe size={16} /> Shop Slug (URL)
            </label>
            <div className="flex">
              <span className="flex items-center rounded-l-xl border-y border-l border-slate-700 bg-slate-700/50 px-3 text-slate-500 text-xs">imart.com/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full rounded-r-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Tag size={16} /> Business Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Beauty">Beauty</option>
              <option value="Groceries">Groceries</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <MapPin size={16} /> Business Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={20} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-red-900/30 bg-red-900/10 p-8">
        <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
        <p className="text-sm text-slate-400 mt-1">Suspending your store will hide all your products from the marketplace instantly.</p>
        <button className="mt-4 rounded-xl border border-red-900/50 px-6 py-2 text-sm font-bold text-red-500 hover:bg-red-900/20">
          Suspend Store
        </button>
      </div>
    </div>
  );
}
