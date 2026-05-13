"use client";

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Utensils, Scissors, Truck, Package, Wrench } from 'lucide-react';
import Navbar from './Navbar';

interface SearchState {
  term: string;
  location: string;
}

const slides = [
  {
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600",
    title: "Delicious flavors nearby.",
    placeholder: "Restaurants, cafes, bars...",
    category: "Restaurants"
  },
  {
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600",
    title: "Your style, your way.",
    placeholder: "Boutiques, tailors, designers...",
    category: "Fashion"
  },
  {
    url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1600",
    title: "Reliable help at home.",
    placeholder: "Electricians, plumbers, handymen...",
    category: "Home Services"
  },
  {
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600",
    title: "Moving made simple.",
    placeholder: "Couriers, movers, delivery...",
    category: "Logistics"
  },
  {
    url: "https://images.unsplash.com/photo-1506484334402-40ff22e0d46a?q=80&w=1600",
    title: "Bulk quality, fresh daily.",
    placeholder: "Wholesalers, grains, pantry...",
    category: "Dry Foods"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [search, setSearch] = useState<SearchState>({
    term: '',
    location: ''
  });

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', search.term, 'in', search.location);
  };

  return (
    <div className="relative h-[750px] w-full flex flex-col items-center overflow-hidden">
      
      {/* Background Slider */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${slide.url}')` }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* --- NAVBAR CONTAINER (90% Width) --- */}
      <div className="relative z-20 w-[90%] max-w-[1440px] mt-2">
        <div className="   overflow-hidden">
           <Navbar />
        </div>
      </div>

      {/* --- HERO CONTENT (Centered in remaining space) --- */}
      <div className="relative z-10 w-full max-w-4xl px-4 text-center mt-[50px] mb-auto">
        
        {/* Dynamic Title */}
        <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-10 tracking-tight transition-all duration-700 drop-shadow-md">
          {slides[currentSlide].title}
        </h1>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center bg-white rounded-xl overflow-hidden shadow-2xl p-1.5 transition-all duration-300 focus-within:ring-4 focus-within:ring-red-500/20"
        >
          {/* Search Term */}
          <div className="flex items-center flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 px-5 py-5">
            <span className="text-gray-900 font-bold text-sm uppercase tracking-wider mr-3">Find</span>
            <input
              type="text"
              placeholder={slides[currentSlide].placeholder}
              className="w-full focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
              value={search.term}
              onChange={(e) => setSearch({ ...search, term: e.target.value })}
            />
          </div>

          {/* Location */}
          <div className="flex items-center flex-1 w-full px-5 py-5">
            <span className="text-gray-900 font-bold text-sm uppercase tracking-wider mr-3">Near</span>
            <input
              type="text"
              placeholder="Lagos, Nigeria"
              className="w-full focus:outline-none text-gray-800 font-medium"
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
            />
            <MapPin className="text-red-500 ml-2 h-5 w-5" />
          </div>

          {/* Search Button */}
          <button 
            type="submit"
            className="bg-[#d32323] hover:bg-[#b01d1d] text-white px-10 py-5 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center"
          >
            <Search className="h-6 w-6 stroke-[3px]" />
          </button>
        </form>

        {/* Quick Categories Bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-white font-semibold">
          <button className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Utensils size={20} className="group-hover:scale-110 transition-transform" /> Restaurants
          </button>
          <button className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Scissors size={20} className="group-hover:scale-110 transition-transform" /> Fashion
          </button>
          <button className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Wrench size={20} className="group-hover:scale-110 transition-transform" /> Home Services
          </button>
          <button className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Package size={20} className="group-hover:scale-110 transition-transform" /> Dry Foods
          </button>
          <button className="flex items-center gap-2.5 hover:text-red-400 transition group">
            <Truck size={20} className="group-hover:scale-110 transition-transform" /> Logistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;