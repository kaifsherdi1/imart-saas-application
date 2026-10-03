'use client';

import React from 'react';
import { API_URL } from '@/lib/config';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Store, Star, MapPin, Tag, ShoppingBag } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';

// Using a custom fetch since this is a public route not yet in RTK Query
async function fetchStore(slug: string) {
  const res = await fetch(`${API_URL}/public/stores/${slug}`);
  if (!res.ok) throw new Error('Store not found');
  return res.json();
}

export default function PublicStoreProfile() {
  const { slug } = useParams();
  
  // Note: Usually we'd add this to productsApi.ts, but let's implement a clean local fetch for speed
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStore(slug as string)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  if (!data) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Store not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Store Header */}
      <div className="relative h-64 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
        <div className="relative mx-auto max-w-7xl px-8 h-full flex flex-col justify-end pb-12">
          <div className="flex items-end gap-6">
            <div className="h-24 w-24 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-blue-500 shadow-2xl">
              <Store size={48} />
            </div>
            <div>
              <h1 className="text-4xl font-black">{data.name}</h1>
              <div className="mt-2 flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1"><Tag size={16} /> {data.business_category}</span>
                <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {data.avg_rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-8 py-16">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-blue-500" />
            All Products
          </h2>
          <span className="text-slate-500 font-medium">{data.products?.length || 0} items available</span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.products?.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image_url={product.image_url}
              store_name={data.name}
              avg_rating={product.avg_rating}
            />
          ))}
        </div>

        {data.products?.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            This store hasn't uploaded any products yet.
          </div>
        )}
      </main>
    </div>
  );
}
