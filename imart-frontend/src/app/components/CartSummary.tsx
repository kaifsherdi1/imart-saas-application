import React, { useMemo, useCallback } from 'react';
import type { FC } from 'react';
import type { CartItem } from '@/types';
import Swal from 'sweetalert2';

/**
 * Props for the CartSummary component.
 */
interface CartSummaryProps {
  /** List of items in the cart */
  cartItems: CartItem[];
  /** Callback when user proceeds to checkout */
  onCheckout: () => Promise<void>;
}

/**
 * CartSummary – premium dark‑card UI using Tailwind.
 *
 * It uses `useMemo` to memoize the subtotal, tax and total calculations.
 * Without memoization the heavy subtotal computation would run on every render
 * (e.g., when the parent updates unrelated state like a search field), causing
 * UI jank. `useMemo` ensures the calculations run only when `cartItems` changes.
 */
const CartSummary: FC<CartSummaryProps> = ({ cartItems, onCheckout }) => {
  const { subtotal, tax, total } = useMemo(() => {
    const sub = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const t = sub * 0.18; // 18% GST
    return { subtotal: sub, tax: t, total: sub + t };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const handleCheckout = useCallback(async () => {
    try {
      await onCheckout();
      await Swal.fire({
        icon: 'success',
        title: 'Order placed!',
        text: 'Your order has been successfully submitted.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Checkout failed',
        text: (err as Error).message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCheckout]);

  return (
    <div className="rounded-xl bg-gray-800 bg-opacity-70 p-6 text-white shadow-lg backdrop-blur-md">
      <h2 className="mb-4 text-xl font-semibold">Cart Summary</h2>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </li>
        <li className="flex justify-between">
          <span>GST (18%):</span>
          <span>₹{tax.toFixed(2)}</span>
        </li>
        <li className="flex justify-between font-bold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </li>
      </ul>
      <button
        className="mt-4 w-full rounded bg-indigo-600 py-2 font-medium transition hover:bg-indigo-500"
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;
