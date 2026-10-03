import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/lib/config';
import { logout } from '@/slices/authSlice';
import { Product } from '@/types';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
});

// Expired or revoked token: clear the stale session so the user can sign in again.
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && (api.getState() as any).auth.token) {
    api.dispatch(logout());
  }
  return result;
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery,
  tagTypes: ['Product', 'Order', 'Earnings', 'Store', 'Wishlist'],
  endpoints: (builder) => ({
    fetchProducts: builder.query<any, any>({
      query: (filters) => ({
        url: '/products',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }: any) => ({ type: 'Product' as const, id })), { type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    fetchEarnings: builder.query<any, void>({
      query: () => '/dashboard/earnings',
      providesTags: ['Earnings'],
    }),
    fetchDashboardProducts: builder.query<any, void>({
      query: () => '/store/products',
      providesTags: ['Product'],
    }),
    fetchWishlist: builder.query<any, void>({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    toggleWishlist: builder.mutation<any, string>({
      query: (productId) => ({
        url: `/wishlist/toggle`,
        method: 'POST',
        body: { product_id: productId }
      }),
      invalidatesTags: ['Wishlist', 'Product'],
    }),
    applyEmi: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/emi/apply',
        method: 'POST',
        body: formData,
      }),
    }),
    fetchWalletBalance: builder.query<any, void>({
      query: () => '/wallet/balance',
    }),
    importProducts: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/products/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product'],
    }),
    fetchOrders: builder.query<any, void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    fetchStoreOrders: builder.query<any, void>({
      query: () => '/store/orders',
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation<any, { orderId: string; status: string }>({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order', 'Earnings'],
    }),
    // Admin Endpoints
    fetchAdminStores: builder.query<any, void>({
      query: () => '/admin/stores',
      providesTags: ['Store'],
    }),
    approveStore: builder.mutation<any, string>({
      query: (storeId) => ({
        url: `/admin/stores/${storeId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Store'],
    }),
    // Stripe Endpoints
    createCheckoutSession: builder.mutation<any, string>({
      query: (planId) => ({
        url: '/payments/checkout',
        method: 'POST',
        body: { plan_id: planId },
      }),
    }),
    fetchPlans: builder.query<any, void>({
      query: () => '/payments/plans',
    }),
    submitReview: builder.mutation<any, any>({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Product', 'Order'],
    }),
    fetchProductById: builder.query<any, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    updateStore: builder.mutation<any, any>({
      query: (storeData) => ({
        url: '/store/settings',
        method: 'PATCH',
        body: storeData,
      }),
      invalidatesTags: ['Store'],
    }),
    placeOrder: builder.mutation<any, any>({
      query: (cartData) => ({
        url: '/checkout/place-order',
        method: 'POST',
        body: cartData,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useToggleWishlistMutation,
  useFetchEarningsQuery,
  useFetchDashboardProductsQuery,
  useImportProductsMutation,
  useFetchOrdersQuery,
  useFetchStoreOrdersQuery,
  useUpdateOrderStatusMutation,
  useFetchAdminStoresQuery,
  useApproveStoreMutation,
  useCreateCheckoutSessionMutation,
  useFetchPlansQuery,
  useSubmitReviewMutation,
  useFetchProductByIdQuery,
  useUpdateStoreMutation,
  usePlaceOrderMutation,
  useFetchWishlistQuery,
  useApplyEmiMutation,
  useFetchWalletBalanceQuery
} = productsApi;
