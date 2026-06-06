"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Edit3, Globe, Star, MessageSquare, Utensils, ChevronDown, ChevronUp } from 'lucide-react'; 
import { jwtDecode } from 'jwt-decode'; 

interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface MenuItem {
  name: string;
  price: string;
}

interface Business {
  userId: string; 
  name: string;
  category: string;
  location: string;
  email: string;
  phoneNumber: string;
  openTime: string;
  closeTime: string;
  description?: string;
  websiteLink?: string; 
  images: string[];
  reviews: Review[];   
  rating: number;      
  reviewCount: number;  
  menu?: MenuItem[]; // 🚀 Added menu items type array reference
}

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const BusinessDetails = () => {
  const { id } = useParams(); 
  const router = useRouter();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false); 
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // 🚀 Dropdown collapse toggle state tracker

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await axios.get<{ success: boolean; data: Business }>(`${API_BASE_URL}/business/${id}`);
        const businessData = response.data.data;
        setBusiness(businessData);

        // --- CHECK USER OWNERSHIP ---
        const token = localStorage.getItem('token');
        if (token && businessData.userId) {
          try {
            const decoded = jwtDecode<DecodedToken>(token);
            if (decoded.id === businessData.userId) {
              setIsOwner(true);
            }
          } catch (jwtError) {
            console.error("Invalid token parsing session structure", jwtError);
          }
        }
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBusinessDetails();
  }, [id]);

  if (loading) return <p className="p-20 text-center">Loading details...</p>;
  if (!business) return <p className="p-20 text-center">Business not found.</p>;

  const formatUrl = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <main className="max-w-6xl mx-auto p-6 relative">
      
      {/* EDIT BUTTON CONDITIONAL LAYOUT */}
      {isOwner && (
        <button
          onClick={() => router.push(`/business/edit/${id}`)} 
          className="absolute top-6 right-6 z-30 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-[0.98]"
        >
          <Edit3 size={16} />
          Edit Content
        </button>
      )}

      {/* Header / Cover Image */}
      {business.images && business.images.length > 0 && (
        <div className="w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-inner border relative">
          <img 
            src={`${API_BASE_URL}/${business.images[0]}`} 
            className="w-full h-full object-cover" 
            alt={business.name} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-extrabold">{business.name}</h1>
            
            {business.reviewCount > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2.5 py-1 rounded-lg text-sm">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{business.rating}</span>
                <span className="text-gray-400 font-normal">({business.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          {business.description && <p className="text-gray-600 mb-6">{business.description}</p>}

          {/* 🚀 CONDITIONAL RESTAURANT DROP DOWN MENU COMPONENT BLOCK */}
          {business.category === 'Restaurants' && (
            <div className="mb-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100/80 transition-colors border-b border-gray-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">View Food Menu</h3>
                    <p className="text-xs text-gray-400 font-medium">Explore dishes and prices for this establishment.</p>
                  </div>
                </div>
                {menuOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>

              {menuOpen && (
                <div className="p-6 divide-y divide-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  {business.menu && business.menu.length > 0 ? (
                    business.menu.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                        <div>
                          <h4 className="font-bold text-gray-800 text-base">{item.name}</h4>
                        </div>
                        <span className="text-sm font-extrabold text-[#007185] bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
                          {item.price}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-400 py-4 italic">No menu items added yet by this restaurant.</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            {business.images.slice(1).map((img, i) => (
              <img 
                key={i} 
                src={`${API_BASE_URL}/${img}`} 
                className="rounded-lg h-48 w-full object-cover border" 
                alt={`${business.name} gallery ${i + 1}`}
              />
            ))}
          </div>

          {/* REVIEW FEED SECTION */}
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                <MessageSquare size={22} className="text-gray-500" />
                Customer Reviews
              </h2>
              <button
                onClick={() => router.push(`/reviews/write/${id}`)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm px-4 py-2 rounded-xl transition-colors border"
              >
                Write a Review
              </button>
            </div>

            {business.reviews && business.reviews.length > 0 ? (
              <div className="space-y-4">
                {business.reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">{review.userName}</h4>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed">
                <p className="text-gray-400 text-sm font-medium">No reviews posted yet. Be the first to add your thoughts!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Card Layout */}
        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit sticky top-6">
          <h2 className="font-bold text-xl mb-4">Contact & Hours</h2>
          <div className="space-y-4 text-gray-700">
             <p>📍 {business.location}</p>
             <p>📞 {business.phoneNumber}</p>
             <p>✉️ {business.email}</p>

             {/* OPTIONAL WEBSITE REDIRECT LINK LAYER */}
             {business.websiteLink && business.websiteLink.trim() !== "" && (
               <div className="pt-1">
                 <a 
                   href={formatUrl(business.websiteLink)}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-[#007185] hover:text-[#005f70] font-semibold hover:underline transition-colors group"
                 >
                   <Globe size={18} className="text-gray-400 group-hover:text-[#005f70] transition-colors" />
                   <span>Website</span>
                 </a>
               </div>
             )}

             <p className="pt-4 border-t">⏰ {business.openTime} - {business.closeTime}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BusinessDetails;