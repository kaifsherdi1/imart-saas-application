'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useToggleWishlistMutation } from '@/services/productsApi';
import Image from 'next/image';
import { getProductImage } from '@/utils/imageMapper';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string;
  store_name: string;
  avg_rating: number;
  is_wishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ 
  id, 
  name, 
  price, 
  image_url, 
  store_name, 
  avg_rating,
  is_wishlisted 
}) => {
  const [toggleWishlist] = useToggleWishlistMutation();

  return (
    <div className="industrial-card group flex flex-col h-full">
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image 
          src={getProductImage(name, undefined, image_url)} 
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Floating Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <Link 
            href={`/products/${id}`}
            className="h-12 w-12 flex items-center justify-center rounded-xl bg-white text-black hover:bg-primary hover:text-white transition-all shadow-xl"
          >
            <Eye size={20} />
          </Link>
          <button 
            className="h-12 w-12 flex items-center justify-center rounded-xl bg-white text-black hover:bg-primary hover:text-white transition-all shadow-xl"
          >
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={() => toggleWishlist(id)}
          className="absolute right-4 top-4 z-10 rounded-xl bg-black/40 p-3 text-white backdrop-blur-md transition-all hover:bg-white hover:text-primary"
        >
          <Heart size={18} className={is_wishlisted ? "fill-primary text-primary" : ""} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{store_name}</span>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 border border-white/5">
            <Star size={10} className="fill-primary text-primary" />
            <span className="text-[10px] font-bold text-slate-300">{avg_rating || '0.0'}</span>
          </div>
        </div>

        <Link href={`/products/${id}`}>
          <h3 className="mb-4 text-lg font-bold text-white transition-colors hover:text-primary line-clamp-1 uppercase tracking-tight">{name}</h3>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Price</span>
            <span className="text-xl font-black text-white">₹{price}</span>
          </div>
          <Link 
            href={`/products/${id}`}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors"
          >
            Details <span className="text-primary">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;

