'use client';

import React, { useState } from 'react';
import { useFetchDashboardProductsQuery, useImportProductsMutation } from '@/services/productsApi';
import { getProductImage } from '@/utils/imageMapper';
import { motion } from 'framer-motion';
import { Package, Plus, Upload, MoreHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MerchantProductsPage() {
  const { data: productsData, isLoading } = useFetchDashboardProductsQuery();
  const [importProducts, { isLoading: isImporting }] = useImportProductsMutation();
  const products = productsData?.data || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await importProducts(formData).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Import Started',
        text: 'Your products are being processed in the background. You will be notified once complete.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Import Failed',
        text: error?.data?.message || 'There was an error uploading the file.',
        background: '#0f172a',
        color: '#fff',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-slate-400">Manage your store inventory and bulk imports.</p>
        </div>
        
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-medium text-white transition-all hover:bg-slate-700">
            <Upload size={18} />
            <span>{isImporting ? 'Uploading...' : 'Bulk Import'}</span>
            <input type="file" className="hidden" accept=".xlsx,.csv" onChange={handleFileUpload} disabled={isImporting} />
          </label>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700">
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <table className="w-full text-left">
          <thead className="border-b border-slate-800 bg-slate-800/50 text-sm font-medium text-slate-400">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4 h-16 bg-slate-800/20" />
                </tr>
              ))
            ) : products.map((product: any) => (
              <tr key={product.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-800 overflow-hidden">
                      {product.image_url && <img src={getProductImage(product.name, product.category, product.image_url)} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-white">₹{product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={product.stock < 10 ? 'text-red-400' : 'text-slate-300'}>
                      {product.stock} units
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-white">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Package size={48} className="mb-4 opacity-20" />
            <p>No products listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
