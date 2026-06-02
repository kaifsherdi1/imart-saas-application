'use client';

import React from 'react';
import { useFetchAdminStoresQuery, useApproveStoreMutation } from '@/services/productsApi';
import { motion } from 'framer-motion';
import { ShieldCheck, Store, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminStoresPage() {
  const { data: storesResponse, isLoading } = useFetchAdminStoresQuery();
  const [approveStore, { isLoading: isApproving }] = useApproveStoreMutation();
  const stores = storesResponse?.data || [];

  const handleApprove = async (storeId: string) => {
    const result = await Swal.fire({
      title: 'Approve Store?',
      text: "This will allow the merchant to start selling and initiate their 30-day free trial.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Yes, Approve!',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        await approveStore(storeId).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Store Approved',
          text: 'The merchant has been notified and their trial has started.',
          background: '#0f172a',
          color: '#fff',
        });
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Approval Failed',
          text: err.data?.message || 'Could not approve store.',
          background: '#0f172a',
          color: '#fff',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-blue-500" />
              Platform Administration
            </h1>
            <p className="text-slate-400 mt-1">Review and manage store applications.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 rounded-full px-6 py-2 border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm font-medium">Pending: {stores.filter((s: any) => s.status === 'pending').length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-slate-900 border border-slate-800" />)
          ) : stores.map((store: any) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl transition-all hover:bg-slate-900"
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className={`rounded-2xl p-4 bg-slate-800 text-blue-400 group-hover:scale-110 transition-transform`}>
                  <Store size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{store.name}</h3>
                  <p className="text-sm text-slate-400">Owner: {store.user?.name} ({store.user?.email})</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col items-end">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {store.status === 'pending' ? (
                      <>
                        <Clock size={16} className="text-yellow-500" />
                        <span className="text-sm font-bold text-yellow-500 uppercase">Pending Review</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm font-bold text-green-500 uppercase">Active</span>
                      </>
                    )}
                  </div>
                </div>

                {store.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(store.id)}
                    disabled={isApproving}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-900/20 disabled:opacity-50"
                  >
                    {isApproving ? 'Approving...' : 'Approve Store'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {stores.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Store size={64} className="mb-4 opacity-10" />
              <p className="text-xl font-medium">No store applications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
