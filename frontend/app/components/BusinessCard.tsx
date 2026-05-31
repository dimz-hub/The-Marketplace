"use client";

import React from 'react';
import { Star, Clock, MapPin, MessageSquare, Dot } from 'lucide-react';
import Link from 'next/link';

interface BusinessCardProps {
  business: {
    id?: string;  // Make it optional
    _id?: string;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    priceLevel: number;
    tags: string[];
    closingTime: string;
    location: string;
    topComment: string;
  };
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  console.log("Rendering BusinessCard for:", business);
  const businessId = business.id || business._id;
  return (
    <Link href={`/business/${businessId}`}>

    <div className="group flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 max-w-4xl mb-6 h-full md:h-56">
      
      {/* 1. Image Section - Fixed size on Desktop */}
      <div className="relative w-full md:w-56 lg:w-64 h-48 md:h-full shrink-0 overflow-hidden bg-gray-100">
        <img 
          src={business.image} 
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Rating Badge (Mobile Only Overlay) */}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-bold md:hidden shadow-sm">
          {business.rating} ★
        </div>
      </div>

      {/* 2. Details Section */}
      <div className="flex-1 p-4 md:p-5 flex flex-col justify-between overflow-hidden">
        <div className="space-y-1">
          {/* Title and Price */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#007185] transition-colors truncate">
              {business.name}
            </h3>
            <div className="flex text-gray-500 text-xs md:text-sm font-medium shrink-0">
              {[...Array(4)].map((_, i) => (
                <span key={i} className={i < business.priceLevel ? "text-gray-800" : "text-gray-200"}>$</span>
              ))}
            </div>
          </div>

          {/* Rating Row */}
          <div className="flex items-center space-x-2">
            <div className="flex text-orange-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(business.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-medium">{business.reviewCount} reviews</span>
          </div>

          {/* Tags and Location */}
          <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-600 gap-1">
            {business.tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{tag}</span>
                {idx < business.tags.length - 1 && <Dot size={12} className="text-gray-400" />}
              </React.Fragment>
            ))}
            <Dot size={12} className="text-gray-400" />
            <span className="flex items-center gap-1 truncate max-w-[150px] md:max-w-none">
              <MapPin size={12} /> {business.location}
            </span>
          </div>

          {/* Closing Time */}
          <div className="flex items-center text-xs md:text-sm font-semibold text-gray-700">
            <Clock size={12} className="mr-1 text-green-600" />
            <span className="text-green-700">Open</span>
            <span className="text-gray-400 font-normal mx-1">until</span>
            <span>{business.closingTime}</span>
          </div>
        </div>

        {/* 3. Review Snippet */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2 italic text-gray-500 text-xs md:text-sm">
          <MessageSquare size={16} className="shrink-0 text-gray-300 mt-0.5" />
          <p className="line-clamp-1 md:line-clamp-2">
            "{business.topComment}"
          </p>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default BusinessCard;