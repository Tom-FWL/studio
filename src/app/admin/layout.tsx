
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // While loading, show a spinner or skeleton screen
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated, render the children
  if (user) {
    return <>{children}</>;
  }

  // If not loading and no user, this will soon be redirected by the useEffect.
  // Returning null prevents a flash of unauthenticated content.
  return null;
}
