"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    // Grab the dynamic destination path passed down from the backend OAuth pipeline
    const redirectTo = searchParams.get('redirectTo');

    if (token) {
      // 1. Store the token exactly how your credential login flow does
      localStorage.setItem('token', token);
      
      // 2. Decode the target path if it exists to handle special characters, fallback to homepage
      const destination = redirectTo ? decodeURIComponent(redirectTo) : '/';
      
      // 3. Clear out old histories and push the user directly to their true final destination
      router.replace(destination);
    } else {
      router.replace('/login?error=oauth_token_missing');
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-[#d32323]" size={40} />
      <p className="text-gray-600 font-semibold tracking-wide text-sm">
        Authenticating session securely...
      </p>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Suspense boundary is required by Next.js when using useSearchParams in Client Components */}
      <Suspense fallback={<Loader2 className="animate-spin text-gray-400" size={32} />}>
        <LoginSuccessContent />
      </Suspense>
    </main>
  );
}