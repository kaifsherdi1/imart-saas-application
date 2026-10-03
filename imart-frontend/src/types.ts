// src/types.ts

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  store_name: string;
  avg_rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'customer';
  token?: string;
  store?: Store;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  status?: 'pending' | 'active' | 'suspended' | 'rejected';
  address?: string;
  category?: string;
}
