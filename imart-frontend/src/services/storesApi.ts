import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/lib/config';

export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}` }),
  endpoints: (builder) => ({
    fetchStores: builder.query<any, void>({
      query: () => '/stores',
    }),
    fetchStoreBySlug: builder.query<any, string>({
      query: (slug) => `/public/stores/${slug}`,
    }),
  }),
});

export const { useFetchStoresQuery, useFetchStoreBySlugQuery } = storesApi;
