"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Interface for explicitly passing our server-resolved params down as props
interface LoginSuccessContentProps {
  tokenParam: string | null;
  redirectToParam: string | null;
}

function LoginSuccessContent({ tokenParam, redirectToParam }: LoginSuccessContentProps) {
  const router = useRouter();

  useEffect(() => {
    // Read directly from props rather than calling useSearchParams() inside the hook
    if (tokenParam) {
      // 1. Store the token exactly how your credential login flow does
      localStorage.setItem('token', tokenParam);
      
      // 2. Decode the target path if it exists to handle special characters, fallback to homepage
      const destination = redirectToParam ? decodeURIComponent(redirectToParam) : '/';
      
      // 3. Clear out old histories and push the user directly to their true final destination
      router.replace(destination);
    } else {
      router.replace('/login?error=oauth_token_missing');
    }
  }, [tokenParam, redirectToParam, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-[#d32323]" size={40} />
      <p className="text-gray-600 font-semibold tracking-wide text-sm">
        Authenticating session securely...
      </p>
    </div>
  );
}

// Next.js 15 Page layout wrapper handling the dynamic params parsing safely on the server
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginSuccessPage({ searchParams }: PageProps) {
  // Await the asynchronous search params context mandated by Next.js 15
  const resolvedParams = await searchParams;
  
  const tokenValue = typeof resolvedParams.token === 'string' ? resolvedParams.token : null;
  const redirectValue = typeof resolvedParams.redirectTo === 'string' ? resolvedParams.redirectTo : null;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* We can safely render the component here because the server pre-populates the properties */}
      <LoginSuccessContent tokenParam={tokenValue} redirectToParam={redirectValue} />
    </main>
  );
}