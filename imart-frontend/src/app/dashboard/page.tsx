'use client';

import React from 'react';
import { useFetchEarningsQuery } from '@/services/productsApi';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react';

export default function DashboardOverview() {
  const { data: earnings, isLoading } = useFetchEarningsQuery();

  const stats = [
    { name: "Today's Revenue", value: `₹${earnings?.data?.today || 0}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Monthly Earnings", value: `₹${earnings?.data?.this_month || 0}`, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Annual Total", value: `₹${earnings?.data?.this_year || 0}`, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "All-Time Revenue", value: `₹${earnings?.data?.all_time || 0}`, icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  if (isLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-800/50" />)}
      </div>
      <div className="h-64 rounded-2xl bg-slate-800/50" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h3 className="text-lg font-semibold mb-6">Sales Performance</h3>
          <div className="flex h-64 items-center justify-center text-slate-500 italic">
            [Chart Component will be integrated here]
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800" />
                <div>
                  <p className="text-sm font-medium">New order #827{i}</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
