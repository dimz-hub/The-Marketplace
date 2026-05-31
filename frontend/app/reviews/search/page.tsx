"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

interface SuggestionItem {
  _id: string;
  name: string;
  category: string;
  location: string;
}

export default function ReviewSearchSelection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const queryStr = searchTerm.trim();
      if (queryStr.length >= 2) {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:4000/business/suggestions?query=${queryStr}`);
          if (response.data.success) {
            setSuggestions(response.data.data);
          }
        } catch (error) {
          console.error("Failed gathering query items", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <>

    <div className="max-w-2xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Write a Review</h1>
      <p className="text-gray-500 mb-8">Search and choose the business you want to rate and write about.</p>

      <div className="relative">
        <div className="flex items-center w-full bg-white border border-gray-300 rounded-xl px-4 py-4 shadow-sm focus-within:ring-2 focus-within:ring-[#007185] focus-within:border-transparent transition-all">
          <Search className="text-gray-400 mr-3" size={22} />
          <input 
            type="text"
            placeholder="Type business name or category (e.g. Burger joint...)"
            className="w-full focus:outline-none text-gray-800 font-medium bg-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && <Loader2 className="animate-spin text-gray-400 ml-2" size={20} />}
        </div>

        {/* Results Block Layout */}
        {suggestions.length > 0 && (
          <div className="mt-4 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {suggestions.map((item) => (
              <div
                key={item._id}
                onClick={() => router.push(`/reviews/write/${item._id}`)}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-b-0 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-0.5">{item.category}</p>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin size={14} className="mr-1 text-red-500" />
                  <span>{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchTerm.trim().length >= 2 && !loading && suggestions.length === 0 && (
          <p className="text-center text-gray-400 mt-8 text-sm">No businesses matched your description entry query criteria.</p>
        )}
      </div>
    </div>
        </>
  );
}