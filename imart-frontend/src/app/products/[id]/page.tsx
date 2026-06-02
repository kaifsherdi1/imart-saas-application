'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchProductByIdQuery, useSubmitReviewMutation, useToggleWishlistMutation, useFetchWishlistQuery } from '@/services/productsApi';
import { getProductImage } from '@/utils/imageMapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCcw, CheckCircle2, Heart } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/slices/cartSlice';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: productResponse, isLoading, error } = useFetchProductByIdQuery(id as string);
  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();
  const [toggleWishlist] = useToggleWishlistMutation();
  const { data: wishlistData } = useFetchWishlistQuery();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const product = productResponse?.data;
  const isLiked = wishlistData?.data?.some((p: any) => p.id === product?.id) || false;

  const handleLike = async () => {
    if (!product) return;
    try {
      await toggleWishlist(product.id).unwrap();
      Swal.fire({
        icon: 'success',
        title: isLiked ? 'Removed from Wishlist' : 'Added to Wishlist',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#0f172a',
        color: '#fff',
      });
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Oops', text: 'Please login to wishlist items.', background: '#0f172a', color: '#fff' });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }));
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${product.name} is now in your basket.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#0f172a',
      color: '#fff',
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }));
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview({
        reviewable_id: id,
        reviewable_type: 'product',
        rating,
        comment
      }).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Review Posted',
        text: 'Thank you for your feedback!',
        background: '#0f172a',
        color: '#fff',
      });
      setComment('');
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Review Denied',
        text: err.data?.message || 'Only verified buyers can leave reviews.',
        background: '#0f172a',
        color: '#fff',
      });
    }
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-950"><div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  if (error || !product) return <div className="text-center py-20 text-white">Product not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50"
          >
            {product.image_url ? (
              <img src={getProductImage(product.name, product.category, product.image_url)} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-700">No Image</div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-500">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                    {product.category}
                  </span>
                  <span className="text-slate-500">•</span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-bold">{product.avg_rating || 'No ratings'}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLike}
                  className={`p-3 rounded-full border transition-all ${isLiked ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-400/50'}`}
                >
                  <Heart size={24} className={isLiked ? "fill-rose-500" : ""} />
                </button>
              </div>
              <h1 className="mt-4 text-5xl font-extrabold tracking-tight">{product.name}</h1>
              <p className="mt-2 text-xl text-slate-400">Sold by <span className="text-blue-400 font-semibold">{product.store?.name}</span></p>
            </div>

            <p className="text-lg leading-relaxed text-slate-300">
              {product.description || 'No description provided for this premium iMart product.'}
            </p>

            <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-white">₹{product.price}</span>
              <div className="flex flex-col text-sm text-slate-400">
                <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> In Stock</span>
                <span className="flex items-center gap-2"><Truck size={14} className="text-blue-500" /> Free Delivery</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-slate-700 bg-transparent py-4 text-lg font-bold text-white transition-all hover:bg-slate-800"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-900/40"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-800">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck size={20} className="text-blue-500" />
                <span className="text-sm font-medium">100% Authentic</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <RefreshCcw size={20} className="text-blue-500" />
                <span className="text-sm font-medium">7-Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 border-t border-slate-800 pt-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            
            {/* Submit Review Form */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold">Leave a Review</h3>
              <p className="mt-2 text-slate-400">Share your experience with other buyers.</p>
              
              <form onSubmit={handleReviewSubmit} className="mt-8 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                <div>
                  <label className="block text-sm font-medium text-slate-400">Rating</label>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-colors ${rating >= star ? 'text-yellow-500' : 'text-slate-700'}`}
                      >
                        <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400">Comment</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="What did you think of the quality?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-slate-100 py-4 font-bold text-slate-900 transition-all hover:bg-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-2xl font-bold">Verified Buyer Reviews ({product.reviews?.length || 0})</h3>
              
              <div className="space-y-6">
                {product.reviews?.length > 0 ? product.reviews.map((review: any) => (
                  <div key={review.id} className="rounded-3xl border border-slate-800 p-8 transition-all hover:bg-slate-900/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold">
                          {review.user?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-bold">{review.user?.name || 'Verified Customer'}</p>
                          <div className="flex gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium uppercase tracking-widest text-slate-500">Verified Purchase</span>
                    </div>
                    <p className="mt-6 text-lg text-slate-300 italic">"{review.comment}"</p>
                  </div>
                )) : (
                  <div className="py-12 text-center text-slate-500 italic">No reviews yet. Be the first to review this product!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
