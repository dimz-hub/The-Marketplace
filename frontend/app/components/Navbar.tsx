"use client";

import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, Bell, MessageSquare, UserCircle } from 'lucide-react';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Restaurants');

  return (
    <nav className="w-[90vw]  sticky top-0 z-50">
      {/* Top Bar: Logo, Search, and Auth */}
      <div className="max-w-8xl mx-auto px-4 h-20 flex items-center gap-8">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <span className="text-3xl font-black text-[#d32323] tracking-tighter cursor-pointer">
            yelp<span className="text-gray-900">.</span>
          </span>
        </div>

        {/* Unified Search Bar */}
        <div className="hidden md:hidden flex-1 items-center bg-white border-2 border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition-all">
          <div className="flex-[1.2] flex items-center px-4 py-2 border-r border-gray-200">
            <span className="text-sm font-bold text-gray-800 mr-2 shrink-0">Find</span>
            <input 
              type="text" 
              placeholder="burgers, barbers, auto repair..." 
              className="w-full text-sm outline-none placeholder-gray-400"
            />
          </div>
          <div className="flex-1  flex items-center px-4 py-2">
            <span className="text-sm font-bold text-gray-800 mr-2 shrink-0">Near</span>
            <input 
              type="text" 
              placeholder="Lagos, Nigeria" 
              className="w-full text-sm outline-none placeholder-gray-400"
            />
            <MapPin size={18} className="text-gray-400 ml-2 cursor-pointer hover:text-gray-600" />
          </div>
          <button className="bg-[#d32323] p-3 rounded-r-md hover:bg-[#b01d1d] transition-colors">
            <Search size={20} className="text-white" strokeWidth={3} />
          </button>
        </div>

        {/* Desktop Auth & Icons */}
        <div className="flex items-center  gap-4">
          <button className="hidden lg:block text-sm font-bold text-white hover:underline">Yelp for Business</button>
          <button className="hidden lg:block text-sm font-bold text-white hover:underline">Write a Review</button>
          
          <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden lg:block"></div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-white hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-white hover:bg-gray-100 rounded-full transition-colors">
              <MessageSquare size={22} />
            </button>
            <button className="flex items-center gap-1 p-1 pr-2 hover:bg-gray-100 rounded-full transition-colors">
              <UserCircle size={32} className="text-white" />
              <ChevronDown size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Categories/Links */}
      <div className="max-w-7xl mx-auto px-4 h-12 hidden md:flex items-center gap-8">
        {[
          'Restaurants', 'Home Services', 'Auto Services', 'More'
        ].map((link) => (
          <button
            key={link}
            onClick={() => setActiveLink(link)}
            className={`text-sm font-medium h-full flex items-center border-b-2 transition-all gap-1 ${
              activeLink === link 
                ? 'border-[#d32323] text-[#d32323]' 
                : 'border-transparent text-white hover:text-black'
            }`}
          >
            {link}
            {link === 'More' && <ChevronDown size={14} />}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;