"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import Hero from "./components/hero";
import CategorySection from "./components/Category";
import { Loader2 } from 'lucide-react';

/**
 * 🚀 Auth Token Interceptor Component
 * Checks the incoming address bar query structure for Google session keys, 
 * commits them to persistent storage, and cleans the URL cleanly.
 */
function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirectTo = searchParams.get('redirectTo');

    if (token) {
      // 1. Commit the secure session payload key locally 
      localStorage.setItem('token', token);
      
      // 2. Resolve target route fallback paths
      const cleanDestination = redirectTo || '/';
      
      // 3. Wipe the address query strings immediately to protect the session token
      router.replace(cleanDestination);
    }
  }, [searchParams, router]);

  return null; // Invisible structural component logic layer
}

export default function Home() {
  return (
    <div className="">
      {/* Safely wraps the query parameter hook context inside a Suspense layout context.
        This prevents Next.js compilation warnings during build production bundling phases.
      */}
      <Suspense fallback={null}>
        <AuthCallbackHandler />
      </Suspense>

      {/* Your Existing UI Interface Layout Components */}
      <Hero />
      <CategorySection />
    </div>
  );
}