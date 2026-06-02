'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectCartTotal, clearCart } from '@/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { CheckCircle2, CreditCard, Landmark, Truck, ArrowLeft, ArrowRight, Wallet, Banknote } from 'lucide-react';
import Link from 'next/link';
import { usePlaceOrderMutation } from '@/services/productsApi';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.cart.items);
  const totalAmount = useSelector(selectCartTotal);
  const [placeOrder] = usePlaceOrderMutation();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone_1: '',
    phone_2: '',
    shipping_address: '',
    pincode: '',
    landmark: '',
    payment_method: 'cod', // default
  });

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">You need items in your cart to checkout.</p>
        <Link href="/products" className="rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700 transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map((item: any) => ({ id: item.id, quantity: item.quantity })),
        ...formData
      };

      await placeOrder(orderData).unwrap();

      dispatch(clearCart());

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been successfully placed.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        router.push('/account');
      });

    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: err.data?.message || 'Something went wrong.',
        background: '#0f172a',
        color: '#fff',
      });
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
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            {['Personal Details', 'Payment Method', 'Confirmation'].map((label, idx) => (
              <div key={idx} className={`text-sm font-bold ${step >= idx + 1 ? 'text-blue-500' : 'text-slate-500'}`}>
                Step {idx + 1}: {label}
              </div>
            ))}
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">

            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <motion.form key="step1" onSubmit={handleNextStep} variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><Truck className="text-blue-500" /> Shipping Information</h2>
                  <p className="text-slate-400">Please provide your precise delivery address.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name *</label>
                    <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 px-5 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 px-5 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Address *</label>
                  <textarea required rows={3} name="shipping_address" value={formData.shipping_address} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 px-5 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="House No., Building, Street Area" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pincode *</label>
                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 px-5 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="e.g. 500081" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nearby Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 px-5 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="e.g. Near Apollo Hospital" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number 1 *</label>
                    <input required type="text" name="phone_1" value={formData.phone_1} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 px-5 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="Primary mobile number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number 2 (Optional)</label>
                    <input type="text" name="phone_2" value={formData.phone_2} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 px-5 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="Alternate mobile number" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex justify-end">
                  <button type="submit" className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700 transition-all">
                    Continue to Payment <ArrowRight size={20} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 2: Payment Method */}
            {step === 2 && (
              <motion.form key="step2" onSubmit={handleNextStep} variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><CreditCard className="text-blue-500" /> Payment Options</h2>
                  <p className="text-slate-400">Choose how you want to pay for this order.</p>
                </div>

                <div className="space-y-4">
                  {/* COD */}
                  <div className={`rounded-2xl border-2 transition-all ${formData.payment_method === 'cod' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                    <label className="flex cursor-pointer items-center gap-4 p-6">
                      <input type="radio" name="payment_method" value="cod" checked={formData.payment_method === 'cod'} onChange={handleInputChange} className="h-5 w-5 accent-blue-500 cursor-pointer" />
                      <Landmark className={formData.payment_method === 'cod' ? 'text-blue-500' : 'text-slate-500'} size={28} />
                      <div>
                        <h3 className="text-lg font-bold">Cash on Delivery</h3>
                        <p className="text-sm text-slate-400 mt-1">Pay when you receive the order.</p>
                      </div>
                    </label>
                  </div>

                  {/* UPI */}
                  <div className={`rounded-2xl border-2 transition-all ${formData.payment_method === 'upi' ? 'border-green-500 bg-green-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                    <label className="flex cursor-pointer items-center gap-4 p-6">
                      <input type="radio" name="payment_method" value="upi" checked={formData.payment_method === 'upi'} onChange={handleInputChange} className="h-5 w-5 accent-green-500 cursor-pointer" />
                      <Wallet className={formData.payment_method === 'upi' ? 'text-green-500' : 'text-slate-500'} size={28} />
                      <div>
                        <h3 className="text-lg font-bold">UPI / PhonePe</h3>
                        <p className="text-sm text-slate-400 mt-1">Instant digital payment.</p>
                      </div>
                    </label>
                    <AnimatePresence>
                      {formData.payment_method === 'upi' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-6 pt-0 border-t border-green-500/20 mt-2 space-y-4">
                            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Enter UPI ID</label>
                            <div className="flex gap-4">
                              <input type="text" placeholder="example@okicici" className="flex-1 rounded-xl border border-white/10 bg-slate-900 py-3 px-4 text-white placeholder-slate-600 focus:border-green-500/50 focus:outline-none transition-all" />
                              <button type="button" className="rounded-xl bg-green-600 px-6 font-bold text-white hover:bg-green-700 transition-all">Verify</button>
                            </div>
                            <p className="text-xs text-green-500/80">Secure connection established.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card */}
                  <div className={`rounded-2xl border-2 transition-all ${formData.payment_method === 'card' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                    <label className="flex cursor-pointer items-center gap-4 p-6">
                      <input type="radio" name="payment_method" value="card" checked={formData.payment_method === 'card'} onChange={handleInputChange} className="h-5 w-5 accent-purple-500 cursor-pointer" />
                      <CreditCard className={formData.payment_method === 'card' ? 'text-purple-500' : 'text-slate-500'} size={28} />
                      <div>
                        <h3 className="text-lg font-bold">Credit / Debit Card</h3>
                        <p className="text-sm text-slate-400 mt-1">Standard ecommerce checkout.</p>
                      </div>
                    </label>
                    <AnimatePresence>
                      {formData.payment_method === 'card' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-6 pt-0 border-t border-purple-500/20 mt-2 space-y-4">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Card Number</label>
                              <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 px-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Expiry (MM/YY)</label>
                                <input type="text" placeholder="MM/YY" className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 px-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none transition-all" />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">CVV</label>
                                <input type="password" placeholder="***" maxLength={4} className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 px-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none transition-all" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Name on Card</label>
                              <input type="text" placeholder="John Doe" className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 px-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none transition-all" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* iMart Wallet / EMI */}
                  <div className={`rounded-2xl border-2 transition-all ${formData.payment_method === 'wallet' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                    <label className="flex cursor-pointer items-center gap-4 p-6">
                      <input type="radio" name="payment_method" value="wallet" checked={formData.payment_method === 'wallet'} onChange={handleInputChange} className="h-5 w-5 accent-amber-500 cursor-pointer" />
                      <Banknote className={formData.payment_method === 'wallet' ? 'text-amber-500' : 'text-slate-500'} size={28} />
                      <div>
                        <h3 className="text-lg font-bold">iMart Wallet / EMI</h3>
                        <p className="text-sm text-slate-400 mt-1">Pay using your approved EMI balance.</p>
                      </div>
                    </label>
                    <AnimatePresence>
                      {formData.payment_method === 'wallet' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-6 pt-0 border-t border-amber-500/20 mt-2">
                            <p className="text-sm text-amber-500 font-bold">Ensure you have sufficient balance in your iMart Wallet.</p>
                            <Link href="/account/emi" target="_blank" className="text-xs text-blue-400 hover:underline mt-2 inline-block">Apply for iMart EMI</Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 rounded-2xl bg-slate-800 px-8 py-4 font-bold text-white hover:bg-slate-700 transition-all">
                    <ArrowLeft size={20} /> Back
                  </button>
                  <button type="submit" className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700 transition-all">
                    Review Order <ArrowRight size={20} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
              <motion.div key="step3" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><CheckCircle2 className="text-blue-500" /> Review & Confirm</h2>
                  <p className="text-slate-400">Please verify your order details before placing it.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b border-slate-800 pb-2">Order Items</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl">
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-blue-400">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-4">
                      <p className="text-xl font-bold">Total Amount:</p>
                      <p className="text-3xl font-black text-white">₹{totalAmount}</p>
                    </div>
                  </div>

                  {/* Shipping & Payment Summary */}
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-6 rounded-2xl">
                      <h3 className="text-lg font-bold mb-4 text-blue-400">Delivery To</h3>
                      <p className="font-bold">{formData.customer_name}</p>
                      <p className="text-slate-400 text-sm mt-1">{formData.shipping_address}, {formData.landmark}</p>
                      <p className="text-slate-400 text-sm">Pincode: {formData.pincode}</p>
                      <p className="text-slate-400 text-sm mt-2">Phone: {formData.phone_1} {formData.phone_2 ? `, ${formData.phone_2}` : ''}</p>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl">
                      <h3 className="text-lg font-bold mb-2 text-blue-400">Payment Method</h3>
                      <p className="font-bold capitalize">{formData.payment_method === 'cod' ? 'Cash on Delivery' : formData.payment_method === 'upi' ? 'UPI / Digital Wallet' : formData.payment_method === 'wallet' ? 'iMart Wallet' : 'Credit/Debit Card'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 rounded-2xl bg-slate-800 px-8 py-4 font-bold text-white hover:bg-slate-700 transition-all">
                    <ArrowLeft size={20} /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-2xl bg-blue-600 px-10 py-4 text-lg font-black tracking-wide text-white hover:bg-blue-700 transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm & Place Order'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
