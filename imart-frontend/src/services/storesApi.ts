import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/v1' }),
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
