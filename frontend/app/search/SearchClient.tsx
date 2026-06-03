"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Settings2, X, ChevronDown, Check, SlidersHorizontal, Loader2 } from 'lucide-react';
import BusinessCard from '../components/BusinessCard';
import Navbar from '../components/Navbar';

interface RawBusiness {
  id: string;
  _id: string;
  name: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  priceLevel?: string | number;
  category: string;
  closeTime: string;
  location: string;
  description?: string;
}

interface SearchResultsProps {
  findDesc: string;
  locationParam: string;
}

// 🟢 Setup a dynamic base URL that defaults to localhost and uses your hosted URL on Vercel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SearchResultsContent({ findDesc, locationParam }: SearchResultsProps) {
  const [businesses, setBusinesses] = useState<RawBusiness[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('Recommended');
  
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!findDesc) {
        setBusinesses([]);
        setLoading(false);
        return; 
      }
      
      setLoading(true);
      try {
        // 🟢 FIXED: Changed from hardcoded localhost to dynamic API_BASE_URL
        const response = await axios.get<{ data: RawBusiness[] }>(`${API_BASE_URL}/business/search`, {
          params: { find_desc: findDesc }
        });
        setBusinesses(response.data.data);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [findDesc]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'unset';
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priceOptions: string[] = ['$', '$$', '$$$', '$$$$'];
  const suggestedFilters: string[] = ['Open Now', 'Accepts Credit Cards', 'Dogs Allowed'];

  const getPriceLevel = (price: string | number | undefined): number => {
    if (typeof price === 'number') return price;
    return price ? price.length : 2;
  };

  return (
    <>
      <div className="relative z-20 w-[90%] mx-auto max-w-[1440px] mt-2">
         <Navbar color={true}/>
      </div>
      <main className="min-w-full bg-gray-50 min-h-screen relative font-sans">
        {/* --- SIDEBAR OVERLAY --- */}
        <div 
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* --- SLIDE-IN SIDEBAR --- */}
        <aside className={`fixed top-0 left-0 h-full w-[340px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out px-6 py-8 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <SlidersHorizontal size={20} /> All Filters
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Price</h3>
            <div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm">
              {priceOptions.map((p) => (
                <button key={p} className="flex-1 py-2 text-sm font-semibold border-r last:border-r-0 hover:bg-gray-50 active:bg-gray-200 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Suggested</h3>
            <div className="space-y-4">
              {suggestedFilters.map((f) => (
                <label key={f} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-black transition-colors font-medium text-sm">{f}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button className="w-full bg-[#d32323] text-white py-4 rounded-lg font-bold hover:bg-[#b01d1d] transition shadow-md">
            Show {businesses.length} Results
          </button>
        </aside>

        {/* --- MAIN PAGE CONTENT --- */}
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
              {findDesc ? `Best ${findDesc}` : 'Top Businesses'} in {locationParam}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {loading ? 'Searching...' : `Showing ${businesses.length} verified outlets`}
            </p>
          </div>

          {/* --- SORT & FILTER TOOLBAR --- */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`flex items-center gap-1 text-sm font-bold transition-colors py-1 ${isSortOpen ? 'text-red-600' : 'text-gray-700 hover:text-black'}`}
              >
                Sort: {sortBy} <ChevronDown size={16} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-2xl rounded-lg border border-gray-100 py-2 mt-2 z-30">
                  {['Recommended', 'Highest Rated', 'Most Reviewed'].map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center ${sortBy === opt ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <span>{opt}</span>
                      {sortBy === opt && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-bold hover:bg-gray-50 transition shadow-sm bg-white">
              <Settings2 size={18} className="text-gray-600" />
              All Filters
            </button>
          </div>

          {/* --- LISTING RESULTS --- */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
              <p className="text-gray-500 font-medium">Finding the best spots for you...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {businesses.length > 0 ? (
                businesses.map((biz) => {
                  // 🟢 FIXED: Changed image base paths from localhost to dynamic API_BASE_URL
                  const businessImage = biz.images && biz.images.length > 0 
                    ? `${API_BASE_URL}/${biz.images[0].replace(/\\/g, '/')}` 
                    : 'https://via.placeholder.com/400x300?text=No+Image';

                  return (
                    <BusinessCard 
                      key={biz._id} 
                      business={{
                        id: biz.id, 
                        _id: biz._id,
                        name: biz.name,
                        image: businessImage,
                        rating: biz.rating || 0,
                        reviewCount: biz.reviewCount || 0,
                        priceLevel: getPriceLevel(biz.priceLevel),
                        tags: [biz.category],
                        closingTime: biz.closeTime,
                        location: biz.location,
                        topComment: biz.description || "No description provided."
                      }} 
                    />
                  );
                })
              ) : (
                <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg font-medium">No businesses matching "{findDesc}" in {locationParam}.</p>
                  <button onClick={() => window.location.href='/search'} className="mt-4 text-red-600 font-bold hover:underline">
                    Clear all search filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}