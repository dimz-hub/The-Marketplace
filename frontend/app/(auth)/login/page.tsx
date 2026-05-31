"use client";

import React, { useState, ChangeEvent, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Define expected server response payload structures
interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
}

interface BackendErrorResponse {
  message?: string;
  error?: string;
}

// Helper to determine if there is an OAuth error directly from the URL query params
function getOAuthErrorMessage(errorQuery: string | null): string | null {
  if (errorQuery === 'oauth_failed') {
    return 'Google authentication failed. Please try again.';
  }
  if (errorQuery === 'no_user') {
    return 'Could not retrieve user data from profile initialization.';
  }
  if (errorQuery === 'oauth_token_missing') {
    return 'Secure callback session expired. Please sign in again.';
  }
  return null;
}

// Inner content component handling the core logic
function SignInFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  
  // Directly derive the initial validation error message from the URL state right here
  const initialError = getOAuthErrorMessage(searchParams.get('error'));
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
      const response = await axios.post<LoginResponse>('http://localhost:4000/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        
        // Look up the intent query parameter here, fallback to root home directory
        const destination = searchParams.get('redirectTo') || '/';
        
        // Redirect them straight back to their intended protected page location
        router.push(destination);
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (): void => {
    const target = searchParams.get('redirectTo') || '/';
    
    // Updates the format to hit the explicit /auth/google initialization route
    window.location.href = `http://localhost:4000/auth/google?redirectTo=${encodeURIComponent(target)}`;
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Log into your marketplace outlet platform account</p>
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
        Continue with Google
      </button>

      {/* Visual Content Break Divider */}
      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase">Or email sign in</span>
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">Password</label>
            <Link href="/forgot-password" className="text-xs text-red-600 font-bold hover:underline">
              Forgot password?
            </Link>
          </div>
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
              Sign In <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation Link */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account yet?{' '}
        <Link 
          href={`/signup${searchParams.get('redirectTo') ? `?redirectTo=${encodeURIComponent(searchParams.get('redirectTo')!)}` : ''}`} 
          className="text-red-600 font-bold hover:underline"
        >
          Sign up
        </Link>
      </div>

    </div>
  );
}

// Main page export with mandatory Next.js Suspense boundary wrapper
export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 flex justify-center items-center h-64 shadow-xl">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      }>
        <SignInFormContent />
      </Suspense>
    </main>
  );
}