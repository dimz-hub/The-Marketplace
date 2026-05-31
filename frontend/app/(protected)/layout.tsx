"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Safely bounce them out to login while tracking their intended path
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    } else {
      setIsVerified(true);
    }
  }, [router, pathname]);

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}