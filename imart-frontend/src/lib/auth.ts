import { API_URL } from '@/lib/config';
import { logout } from '@/slices/authSlice';
import type { AppDispatch } from '@/store';

/** Revoke the API token server-side, then clear the local session. */
export async function signOut(dispatch: AppDispatch, token: string | null) {
  if (token) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
    } catch {
      // Network failure: the token will still expire server-side.
    }
  }
  dispatch(logout());
}

/** Where a user should land after signing in. */
export function homeForRole(role?: string) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'owner') return '/dashboard';
  return '/account';
}
