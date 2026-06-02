import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import { productsApi } from './services/productsApi';
import { storesApi } from './services/storesApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [storesApi.reducerPath]: storesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware, storesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
