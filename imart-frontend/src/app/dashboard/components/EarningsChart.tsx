'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ChartProps {
  data: Array<{ date: string; total: number }>;
}

export default function EarningsChart({ data }: ChartProps) {
  return (
    <div className="h-[400px] w-full rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Earnings Trend</h3>
          <p className="text-sm text-slate-500">Sales performance over the last 30 days.</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `₹${val}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTotal)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
