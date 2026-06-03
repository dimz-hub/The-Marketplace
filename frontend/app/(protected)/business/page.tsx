"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // 🟢 Updated import
import { Loader2 } from 'lucide-react';
import BusinessForm from '../../components/BusinessForm';
import Navbar from '@/app/components/Navbar';

// 1. Separate workspace view to safely isolate Next.js search parameters context
function BusinessWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 🟢 Updated hook call
  
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // 2. Safely read if an edit parameter exists (e.g., /business?edit=12345)
  const editId = searchParams.get('edit');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Encode current route position into search params so login can bounce them back later
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    } else {
      setCheckingAuth(false);
    }
  }, [router, pathname]);

  // Prevent flash of protected markup during check phase
  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center font-sans gap-2">
        <Loader2 className="animate-spin text-[#d32323]" size={36} />
        <p className="text-slate-500 text-sm font-semibold tracking-wide">Verifying registration session...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-white font-sans">
        
        {/* LEFT COLUMN (50%) */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8 lg:p-20">
          <div className="w-full max-w-lg mt-[-30px]">
            {/* 3. Dynamically alter headers based on whether user is creating or modifying */}
            <h1 className="text-2xl lg:text-[27px] font-bold text-slate-900 mb-2 tracking-tight">
              {editId ? 'Modify your business workspace' : 'Hello! Let’s start with your business name!'}
            </h1>
            <p className="text-slate-500 text-lg mb-10">
              {editId ? 'Update your business profile records below.' : 'Add your business to get started.'}
            </p>

            {/* 4. Pass down editId prop into your form component to fetch/populate fields if editing */}
            <BusinessForm editId={editId} />

            <div className="mt-12 flex items-center gap-2">
              <span className="text-slate-400 text-sm italic">Powered by</span>
              <span className="text-slate-600 font-bold text-sm">Marketplace OS</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (50%) */}
        <div className="hidden md:block w-1/2 relative min-h-screen bg-slate-100">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1500" 
            alt="Marketplace Growth" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]"></div>

          <div className="absolute bottom-12 left-12 right-12 bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
            <div className="flex flex-col gap-4">
              <div className="h-1.5 w-10 bg-[#e47911] rounded-full"></div>
              <p className="text-2xl font-semibold text-slate-800 leading-tight">
                "An average of 2.4 million people visit our marketplace each day"
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Live Analytics 2026
                </span>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-300 shadow-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// 5. Main Component Wrapper delivering necessary Next.js Suspense Context 
export default function BusinessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center font-sans gap-2">
        <Loader2 className="animate-spin text-[#d32323]" size={36} />
        <p className="text-slate-500 text-sm font-semibold tracking-wide">Initializing workspace parameters...</p>
      </div>
    }>
      <BusinessWorkspace />
    </Suspense>
  );
}