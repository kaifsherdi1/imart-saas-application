'use client';

import RequireRole from '../components/RequireRole';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['customer', 'owner', 'admin']}>{children}</RequireRole>;
}
