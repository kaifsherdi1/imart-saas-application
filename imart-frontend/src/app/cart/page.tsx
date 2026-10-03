'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart, updateQuantity, clearCart } from '@/slices/cartSlice';
import { usePlaceOrderMutation } from '@/services/productsApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-slate-900 p-8 text-slate-700">
          <ShoppingBag size={80} />
        </div>
        <h1 className="text-3xl font-bold">Your basket is empty</h1>
        <p className="max-w-md text-slate-400">Looks like you haven't added anything to your cart yet. Start exploring our marketplace!</p>
        <Link href="/" className="rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-12 text-4xl font-black">Shopping Basket</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

        {/* Item List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl"
              >
                <div className="h-24 w-24 rounded-2xl bg-slate-800 overflow-hidden">
                  <img src="https://via.placeholder.com/150" alt={item.name} className="h-full w-full object-cover" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-blue-500 font-bold">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-950 rounded-xl p-2 border border-slate-800">
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    className="p-1 hover:text-blue-500"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="p-1 hover:text-blue-500"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={22} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl space-y-6">
            <h2 className="text-2xl font-bold border-b border-slate-800 pb-4">Order Summary</h2>

            <div className="space-y-4 text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="text-white">₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500 font-bold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-800 pt-6">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-black text-white">₹{total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-900/40"
            >
              <CreditCard size={24} />
              Checkout Securely
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 text-center text-xs text-slate-500">
            By completing your purchase, you agree to iMart's Terms of Service and Privacy Policy. Securely processed by Stripe.
          </div>
        </div>

      </div>
    </div>
  );
}
