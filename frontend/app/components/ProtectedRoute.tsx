"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname(); 
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    // 1. Define lists of public auth pages that should NEVER be intercepted
    const publicAuthPages = ['/login', '/signup', '/login-success', '/forgot-password'];

    // 2. If the user is currently looking at login or signup, let them through instantly!
    if (publicAuthPages.includes(pathname)) {
      setIsVerified(true);
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      // User is not logged in trying to access a locked page (like /business) -> redirect to login
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    } else {
      // User is logged in -> approve rendering
      setIsVerified(true);
    }
  }, [router, pathname]);

  // Show a loading spinner while checking authorization state
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  // Render the actual page content safely
  return <>{children}</>;
}