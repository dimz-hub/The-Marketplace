"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Bell, MessageSquare, UserCircle, LogOut, Menu, X, Briefcase, PenTool } from 'lucide-react';
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
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  // 🟢 State to manage the mobile slide-out menu drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Lock scrolling when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveLink(category);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false); // 🟢 Close drawer on click
    router.push(`/search?find_desc=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsProfileOpen(false); 
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  const textColorClass = color ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:underline';
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
        <div className="hidden md:flex items-center gap-4">
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
                
                <div 
                  ref={profileMenuRef}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`relative flex items-center gap-1 p-1 pr-2 rounded-full transition-colors cursor-pointer ${iconColorClass}`}
                >
                  <UserCircle size={32} />
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 top-11 w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-2 text-gray-900 z-50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleLogout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-bold"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 🟢 Mobile Menu Trigger Button (Hamburger Icon) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={`p-2 rounded-lg transition-colors ${color ? 'text-gray-800' : 'text-white'}`}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* --- MOBILE DRAWER SLIDE OUT --- */}
      {/* Background Dim Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Drawer content layout */}
      <aside className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out p-6 md:hidden text-gray-900 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <span className="font-black text-xl text-[#d32323]">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Marketplace Features */}
          <Link href="/business" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-bold text-gray-800 hover:text-red-600 py-1 transition-colors">
            <Briefcase size={20} className="text-gray-500" /> Marketplace for Business
          </Link>
          
          <Link href="/reviews/search" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-bold text-gray-800 hover:text-red-600 py-1 transition-colors">
            <PenTool size={20} className="text-gray-500" /> Write a Review
          </Link>

          <hr className="border-gray-100" />

          {/* Categories Title */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Categories</p>
            <div className="flex flex-col gap-4 pl-1">
              {['Restaurants', 'Home Services', 'Fashion', 'Dry Foods', 'Logistics'].map((link) => (
                <button
                  key={link}
                  onClick={() => handleCategoryClick(link)}
                  className={`text-left text-base font-semibold transition-colors ${
                    activeLink === link ? 'text-[#d32323]' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100 mt-auto" />

          {/* Dynamic Mobile Auth Controls */}
          <div className="pt-4">
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <button className="w-full py-2.5 font-bold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Log In</button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <button className="w-full py-2.5 font-bold bg-[#d32323] text-white rounded-md hover:bg-[#b01d1d]">Sign Up</button>
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} /> Log Out
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Desktop Bottom Bar: Categories/Links (Hidden on Mobile) */}
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
            <div className="absolute top-full left-0 w-44 bg-white border border-gray-200 shadow-xl rounded-lg py-1 mt-1 z-50 text-gray-900">
              <button
                onClick={() => handleCategoryClick('Dry Food')} // 🚀 FIXED: Added the 's' to match state criteria
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