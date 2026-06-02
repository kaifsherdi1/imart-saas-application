'use client';

import React from 'react';
import { useFetchOrdersQuery, useUpdateOrderStatusMutation } from '@/services/productsApi';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MerchantOrdersPage() {
  const { data: ordersData, isLoading } = useFetchOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const orders = ordersData?.data?.data || [];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ orderId, status: newStatus }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Order status changed to ${newStatus}.`,
        background: '#0f172a',
        color: '#fff',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not update order status.',
        background: '#0f172a',
        color: '#fff',
      });
    }
  };

  const statusIcons: any = {
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    processing: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    shipped: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    delivered: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-slate-400">Track and manage customer orders from your store.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-slate-800/50" />)
        ) : orders.map((order: any) => {
          const StatusIcon = statusIcons[order.status]?.icon || Clock;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 ${statusIcons[order.status]?.bg} ${statusIcons[order.status]?.color}`}>
                    <StatusIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-slate-400">By {order.user?.name || 'Customer'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Amount</p>
                    <p className="font-semibold text-white">₹{order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Date</p>
                    <p className="font-semibold text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Status</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="mt-6 border-t border-slate-800 pt-4">
                <p className="text-sm text-slate-400">
                  Items: {order.items?.map((item: any) => `${item.product?.name} (x${item.quantity})`).join(', ') || 'No items listed'}
                </p>
              </div>
            </motion.div>
          );
        })}

        {orders.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p>No orders received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
