'use client';

import React, { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  Users, 
  Store, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminDashboard() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [pendingStores, setPendingStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, storesRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/stores/pending`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const statsData = await statsRes.json();
      const storesData = await storesRes.json();

      setStats(statsData.data);
      setPendingStores(storesData.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: 'Approve Store?',
      text: "This will start their 30-day trial and make the store live.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      background: '#0f172a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/admin/stores/${id}/approve`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          Swal.fire({ title: 'Success', text: data.message, icon: 'success', background: '#0f172a', color: '#fff' });
          fetchData();
        }
      } catch (error) {
        Swal.fire({ title: 'Error', text: 'Failed to approve store', icon: 'error', background: '#0f172a', color: '#fff' });
      }
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Command Center...</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">Admin Command Center</h1>
          <p className="text-slate-500">Global oversight of the iMart ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-2 text-sm text-slate-400">
          <Clock size={16} /> Last Sync: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Global Stats Grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Stores', val: stats?.total_stores, icon: Store, color: 'text-blue-500' },
          { label: 'Active Stores', val: stats?.active_stores, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Pending Approvals', val: stats?.pending_approvals, icon: AlertTriangle, color: 'text-orange-500' },
          { label: 'Total Volume', val: `₹${stats?.total_revenue}`, icon: TrendingUp, color: 'text-indigo-500' },
        ].map((item, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="text-2xl font-black text-white">{item.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Stores Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-xl">
        <div className="border-b border-slate-800 p-8">
          <h3 className="text-xl font-bold text-white">Pending Store Approvals</h3>
          <p className="text-sm text-slate-500">Review and activate new merchant applications.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-white/5 text-xs font-bold uppercase tracking-widest text-slate-500">
                <th className="px-8 py-4">Merchant Name</th>
                <th className="px-8 py-4">Store Name</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pendingStores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-500">No pending stores found. You are all caught up!</td>
                </tr>
              ) : pendingStores.map((store) => (
                <tr key={store.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-white/10" />
                      <div>
                        <p className="font-bold text-white">{store.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{store.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-300">{store.name}</td>
                  <td className="px-8 py-6">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                      {store.category || 'General'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleApprove(store.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-700"
                    >
                      <CheckCircle size={14} /> Approve Store
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
