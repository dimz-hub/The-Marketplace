"use client";

import React, { useState, ChangeEvent, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Define expected server response payload structures
interface SignUpResponse {
  success: boolean;
  token: string;
  message?: string;
}

interface BackendErrorResponse {
  message?: string;
  error?: string;
}

// Interface for explicitly passing derived search params as props
interface SignUpFormProps {
  errorParam: string | null;
  redirectToParam: string | null;
}

// 🚀 Setup the dynamic environment variable fallback link to handle cross-device mobile routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper to determine if there is an OAuth error directly from the URL query params
function getOAuthErrorMessage(errorQuery: string | null): string | null {
  if (errorQuery === 'oauth_failed') {
    return 'Google registration failed. Please try again.';
  }
  if (errorQuery === 'no_user') {
    return 'Could not retrieve user profile payload during setup registration.';
  }
  if (errorQuery === 'oauth_token_missing') {
    return 'Secure callback registration session expired. Please try again.';
  }
  return null;
}

// Inner content component handling the core registration logic via clean type-safe props
function SignUpFormContent({ errorParam, redirectToParam }: SignUpFormProps) {
  const router = useRouter();

  // --- STATE ---
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  
  // Directly derive the initial validation error message from the passed prop state
  const initialError = getOAuthErrorMessage(errorParam);
  const [error, setError] = useState<string | null>(initialError);

  // --- HANDLERS ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🚀 Adjusted to target your creation route handler endpoint instead
      const response = await axios.post<SignUpResponse>(`${API_BASE_URL}/auth/signup`, formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        
        // Look up the intent query parameter here, fallback to root home directory
        const destination = redirectToParam || '/';
        
        // Redirect them straight back to their intended protected page location
        router.push(destination);
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred during account creation. Please try again.';
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 INTEGRATED: Direct-to-Google OAuth Flow Handler (Bypasses Render screen flashes)
  const handleGoogleLogin = (): void => {
    const target = redirectToParam || '/';
    
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      console.warn("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable!");
      setError("Google authentication is currently unconfigured. Missing Client ID.");
      return;
    }
    
    // 1. Define your Google OAuth Configuration
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    // 2. Point this EXACTLY to the callback path on your Render backend server
    const backendCallbackUrl = `${API_BASE_URL}/auth/google/callback`; 

    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: backendCallbackUrl,
      response_type: 'code',
      scope: 'openid profile email',
      // Pass your final destination route state through to Google so it persists
      state: target, 
    });

    // Send the user directly to Google without seeing the Render domain first
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1">Get started with your marketplace outlet platform account</p>
      </div>

      {/* Google Authentication Trigger Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all shadow-sm mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.33 2.69 1.41 6.62l3.856 3.145z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.275c0-.796-.073-1.564-.205-2.305H12v4.545h6.455a5.532 5.532 0 0 1-2.4 3.632v3.018h3.864c2.264-2.086 3.571-5.16 3.571-8.89z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235L1.41 17.38C3.33 21.31 7.33 24 12 24c3.055 0 5.627-1.01 7.5-2.736l-3.864-3.018a4.441 4.441 0 0 1-6.636-4.01z"
          />
          <path
            fill="#34A853"
            d="M12 4.909c1.905 0 3.432.741 4.14 1.414l3.11-3.11C17.273 1.214 14.882 0 12 0 7.33 0 3.33 2.69 1.41 6.62l3.856 3.145A4.475 4.475 0 0 1 12 4.91z"
          />
        </svg>
        Sign up with Google
      </button>

      {/* Visual Content Break Divider */}
      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase">Or email register</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Credential Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d32323] hover:bg-[#b01d1d] disabled:bg-red-400 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm shadow-md mt-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              Sign Up <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation Link */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link 
          href={`/login${redirectToParam ? `?redirectTo=${encodeURIComponent(redirectToParam)}` : ''}`} 
          className="text-red-600 font-bold hover:underline"
        >
          Sign in
        </Link>
      </div>

    </div>
  );
}

// Next.js 15 wrapper that safely passes async search parameters down into your layout
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  // Await the asynchronous search params context mandated by Next.js 15 architectures
  const resolvedParams = await searchParams;
  
  const errorValue = typeof resolvedParams.error === 'string' ? resolvedParams.error : null;
  const redirectValue = typeof resolvedParams.redirectTo === 'string' ? resolvedParams.redirectTo : null;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 flex justify-center items-center h-64 shadow-xl">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      }>
        <SignUpFormContent errorParam={errorValue} redirectToParam={redirectValue} />
      </Suspense>
    </main>
  );
}