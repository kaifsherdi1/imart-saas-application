'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { User } from '@/types';

const noopSubscribe = () => () => {};

/**
 * Client-side guard for role-restricted areas. The API enforces the same
 * rules server-side; this only keeps users away from screens they can't use.
 */
export default function RequireRole({
  roles,
  children,
}: {
  roles: User['role'][];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  // Auth state is read from localStorage, so wait for the client before deciding.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const allowed = !!token && !!user && roles.includes(user.role);

  useEffect(() => {
    if (mounted && !allowed) {
      router.replace(token ? '/' : '/login');
    }
  }, [mounted, allowed, token, router]);

  if (!mounted || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
