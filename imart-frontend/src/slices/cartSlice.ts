import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCartDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCartDrawer } = cartSlice.actions;

// Memoized Selector for Cart Total
export const selectCartTotal = createSelector(
  [(state: { cart: CartState }) => state.cart.items],
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export default cartSlice.reducer;
