"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Search, MapPin, Utensils, Scissors, Truck, Package, Wrench, Loader2 } from 'lucide-react';
import Navbar from './Navbar';

interface SearchState {
  term: string;
  location: string;
}

interface SuggestionItem {
  _id: string;
  name: string;
  category: string;
  location: string;
}

const slides = [
  { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600", title: "Delicious flavors nearby.", placeholder: "Restaurants, cafes, bars..." },
  { url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600", title: "Your style, your way.", placeholder: "Boutiques, tailors, designers..." },
  { url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1600", title: "Reliable help at home.", placeholder: "Electricians, plumbers, handymen..." },
  { url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600", title: "Moving made simple.", placeholder: "Couriers, movers, delivery..." },
  { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600", title: "Bulk quality, fresh daily.", placeholder: "Wholesalers, grains, pantry..." }
];

const Hero: React.FC = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [search, setSearch] = useState<SearchState>({ term: '', location: '' });
  
  // Suggestion Autocomplete States
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchingSuggestions, setSearchingSuggestions] = useState<boolean>(false);

  // Background slider loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Debounced Suggestion Fetching Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const queryStr = search.term.trim();
      
      if (queryStr.length >= 2) {
        try {
          setSearchingSuggestions(true);
          const response = await axios.get(`http://localhost:4000/business/suggestions?query=${queryStr}`);
          if (response.data.success) {
            setSuggestions(response.data.data);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error("Error retrieving search suggestions", error);
        } finally {
          setSearchingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search.term]);

  // Close dropdown instantly if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    const queryParams = new URLSearchParams();
    if (search.term.trim()) queryParams.append('find_desc', search.term.trim());
    if (search.location.trim()) queryParams.append('location', search.location.trim());
    router.push(`/search?${queryParams.toString()}`);
  };

  const handleSuggestionClick = (item: SuggestionItem) => {
    setSearch(prev => ({ ...prev, term: item.name }));
    setShowDropdown(false);
    router.push(`/business/${item._id}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search?find_desc=${encodeURIComponent(categoryName)}&location=${encodeURIComponent(search.location)}`);
  };

  return (
    <div className="relative h-[750px] w-full flex flex-col items-center overflow-hidden isolation-auto">
      {/* Background Slider */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${slide.url}')` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      <div className="relative z-20 w-[90%] max-w-[1440px] mt-2">
         <Navbar />
      </div>

      {/* --- HERO CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-4xl px-4 text-center mt-[50px] mb-auto transform-none">
        <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-10 tracking-tight drop-shadow-md">
          {slides[currentSlide].title}
        </h1>

        {/* Form Container Context */}
        <div className="relative w-full text-left transform-none" ref={dropdownRef}>
          <form 
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row items-center bg-white rounded-xl overflow-hidden shadow-2xl p-1.5 transition-all duration-300 focus-within:ring-4 focus-within:ring-red-500/20 relative z-30"
          >
            {/* Search Term Input */}
            <div className="flex items-center flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 px-5 py-5 relative">
              <span className="text-gray-900 font-bold text-sm uppercase tracking-wider mr-3">Find</span>
              <input
                type="text"
                placeholder={slides[currentSlide].placeholder}
                className="w-full focus:outline-none text-gray-800 placeholder-gray-400 font-medium bg-transparent"
                value={search.term}
                onChange={(e) => setSearch({ ...search, term: e.target.value })}
                onFocus={() => search.term.trim().length >= 2 && setShowDropdown(true)}
              />
              {searchingSuggestions && (
                <Loader2 className="absolute right-4 text-gray-400 h-5 w-5 animate-spin" />
              )}
            </div>

            {/* Location Input */}
            <div className="flex items-center flex-1 w-full px-5 py-5">
              <span className="text-gray-900 font-bold text-sm uppercase tracking-wider mr-3">Near</span>
              <input
                type="text"
                placeholder="Lagos, Nigeria"
                className="w-full focus:outline-none text-gray-800 font-medium bg-transparent"
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
              />
              <MapPin className="text-red-500 ml-2 h-5 w-5" />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="bg-[#d32323] hover:bg-[#b01d1d] text-white px-10 py-5 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center w-full md:w-auto"
            >
              <Search className="h-6 w-6 stroke-[3px]" />
            </button>
          </form>

          {/* 🚀 FIXED DROPDOWN WORKAROUND WITH DOUBLE-DIV LAYOUT */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-2 right-2 md:left-4 md:right-auto md:w-[calc(50%-12px)] mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 transform-none animate-in fade-in slide-in-from-top-1 duration-150">
              
              {/* This inner div owns the actual scrolling behavior and hides scrollbar artifacts outside its round clipping path */}
              <div className="overflow-y-auto max-h-[260px] w-full rounded-xl
                scrollbar-thin
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-200
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
              >
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-5 py-3.5 hover:bg-gray-50/80 cursor-pointer flex items-center justify-between transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="pr-4 truncate">
                      <p className="font-semibold text-gray-900 truncate text-sm md:text-base">{item.name}</p>
                      <p className="text-[10px] text-gray-400 tracking-wider font-semibold uppercase mt-0.5">{item.category}</p>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs font-medium flex-shrink-0">
                      <MapPin size={12} className="mr-1 text-gray-300" />
                      <span className="max-w-[90px] truncate">{item.location}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Quick Categories Bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-white font-semibold">
          <button onClick={() => handleCategoryClick('Restaurants')} className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Utensils size={20} className="group-hover:scale-110 transition-transform" /> Restaurants
          </button>
          <button onClick={() => handleCategoryClick('Fashion')} className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Scissors size={20} className="group-hover:scale-110 transition-transform" /> Fashion
          </button>
          <button onClick={() => handleCategoryClick('Home Services')} className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Wrench size={20} className="group-hover:scale-110 transition-transform" /> Home Services
          </button>
          <button onClick={() => handleCategoryClick('Dry Food')} className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Package size={20} className="group-hover:scale-110 transition-transform" /> Dry Foods
          </button>
          <button onClick={() => handleCategoryClick('Logistics')} className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Truck size={20} className="group-hover:scale-110 transition-transform" /> Logistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;