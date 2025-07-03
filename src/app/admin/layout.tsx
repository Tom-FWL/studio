
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // The login page does not need protection
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // If loading is finished, not on the login page, and there's no user, redirect to login
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isLoginPage]);

  // While loading, show a spinner (but not on the login page itself)
  if (loading && !isLoginPage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If on the login page, or if authenticated, render the children
  if (isLoginPage || user) {
    return <>{children}</>;
  }

  // If not loading, no user, and not on login page, this will soon be redirected by the useEffect.
  // Returning null prevents a flash of unauthenticated content.
  return null;
}
