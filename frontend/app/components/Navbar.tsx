"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Bell, MessageSquare, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface NavbarProps {
  color?: boolean; 
}

const Navbar: React.FC<NavbarProps> = ({ color }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeLink, setActiveLink] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const currentCategory = searchParams.get('find_desc');
    if (currentCategory) {
      setActiveLink(currentCategory);
    } else {
      setActiveLink(''); 
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveLink(category);
    setIsMoreOpen(false);
    router.push(`/search?find_desc=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const textColorClass = color ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:underline';
  
  // 🟢 FIXED: Removed 'hover:text-black' modifications to ensure clean text behavior
  const categoryTextColorClass = color ? 'text-gray-600 hover:text-gray-800' : 'text-white/90 hover:text-white';
  const iconColorClass = color ? 'text-gray-600 hover:bg-gray-200/50' : 'text-white hover:bg-gray-100/20';

  return (
    <nav className="w-[90vw] sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-8xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-3xl font-black text-[#d32323] tracking-tighter cursor-pointer">
              Marketplace<span className="text-gray-900">.</span>
            </span>
          </Link>
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
          <div className="flex-1 flex items-center px-4 py-2">
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
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/business" className="hidden lg:block cursor-pointer">
                <button className={`hidden lg:block text-sm font-bold ${textColorClass}`}>Marketplace for Business</button>
              </Link>
              <Link href="/login">
                <button className={`text-sm font-bold ${textColorClass}`}>Log In</button>
              </Link>
              <Link href="/signup">
                <button className="text-sm font-bold text-white bg-[#d32323] hover:bg-[#b01d1d] px-4 py-2 rounded-md transition-all">Sign Up</button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/business" className="hidden lg:block cursor-pointer">
                <button className={`hidden lg:block text-sm font-bold ${textColorClass}`}>Marketplace for Business</button>
              </Link>
              <Link href="/reviews/search" className="hidden lg:block cursor-pointer">
                <button className={`hidden lg:block text-sm font-bold ${textColorClass}`}>Write a Review</button>
              </Link>
              <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden lg:block"></div>
              
              <div className="flex items-center gap-3">
                <button className={`p-2 rounded-full transition-colors relative ${iconColorClass}`}>
                  <Bell size={22} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className={`p-2 rounded-full transition-colors ${iconColorClass}`}>
                  <MessageSquare size={22} />
                </button>
                
                <div className={`group relative flex items-center gap-1 p-1 pr-2 rounded-full transition-colors cursor-pointer ${iconColorClass}`}>
                  <UserCircle size={32} />
                  <ChevronDown size={14} />
                  
                  <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-2 hidden group-hover:block text-gray-900">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-bold"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Bar: Categories/Links */}
      <div className="max-w-7xl mx-auto px-4 h-12 hidden md:flex items-center gap-8">
        {['Restaurants', 'Home Services', 'Fashion'].map((link) => (
          <button
            key={link}
            onClick={() => handleCategoryClick(link)}
            className={`text-sm font-medium h-full flex items-center border-b-2 transition-all gap-1 ${
              activeLink === link 
                ? 'border-[#d32323] text-[#d32323]' 
                : `border-transparent ${categoryTextColorClass}`
            }`}
          >
            {link}
          </button>
        ))}

        {/* Persistent Dropdown for 'More' */}
        <div className="relative h-full flex items-center" ref={moreMenuRef}>
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`text-sm font-medium h-full flex items-center border-b-2 transition-all gap-1 ${
              activeLink === 'Dry Foods' || activeLink === 'Logistics' || activeLink === 'More'
                ? 'border-[#d32323] text-[#d32323]' 
                : `border-transparent ${categoryTextColorClass}`
            }`}
          >
            {activeLink === 'Dry Foods' || activeLink === 'Logistics' ? activeLink : 'More'}
            <ChevronDown size={14} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Floating Dropdown Card */}
          {isMoreOpen && (
            <div className="absolute top-full left-0 w-44 bg-white border border-gray-200 shadow-xl rounded-lg py-1 mt-1 z-50 text-gray-900 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => handleCategoryClick('Dry Foods')}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${activeLink === 'Dry Foods' ? 'text-[#d32323] font-bold bg-red-50/50' : 'text-gray-700'}`}
              >
                Dry Foods
              </button>
              <button
                onClick={() => handleCategoryClick('Logistics')}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${activeLink === 'Logistics' ? 'text-[#d32323] font-bold bg-red-50/50' : 'text-gray-700'}`}
              >
                Logistics
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;