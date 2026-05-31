"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, Loader2, ArrowLeft } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // 🚀 Added to parse structural properties

interface BusinessHeaderInfo {
  name: string;
  location: string;
  category: string;
}

// 🚀 Update token parsing schema matching configuration
interface DecodedToken {
  id: string;
  email: string;
  name?: string; // 👈 Catch name parameter structured inside your token string
  exp: number;
}

export default function SubmitReviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [business, setBusiness] = useState<BusinessHeaderInfo | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  
  const [fetching, setFetching] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/business/${id}`);
        if (response.data.success) {
          setBusiness(response.data.data);
        }
      } catch (err) {
        setErrorMsg("Failed to resolve metadata context details.");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchHeaderData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (rating === 0) {
    setErrorMsg("Please select a score rating index value between 1 and 5 stars.");
    return;
  }
  if (comment.trim().length < 5) {
    setErrorMsg("Please write a descriptive layout explanation statement review comment.");
    return;
  }

  try {
    setSubmitting(true);
    setErrorMsg(null);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setErrorMsg("Authentication session reference keys missing. Please authenticate.");
      return;
    }

    // 🚀 FIXED RESOLUTION SYSTEM
    let reviewerName = "Anonymous Reviewer";
    try {
      const decoded = jwtDecode<any>(token);
      console.log("👉 CURRENT FRONTEND TOKEN LOOKUP POOL:", decoded);
      
      // Look for the name directly, or inside a nested user/data object
      if (decoded.name) {
        reviewerName = decoded.name;
      } else if (decoded.user && decoded.user.name) {
        reviewerName = decoded.user.name;
      }
    } catch (e) {
      console.error("Token decoding error details lookup", e);
    }

    const res = await axios.post(
      `http://localhost:4000/business/${id}/review`,
      { 
        rating, 
        comment, 
        userName: reviewerName 
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      router.push(`/business/${id}`); 
    }
  } catch (err: any) {
    setErrorMsg(err.response?.data?.message || err.response?.data?.error || "Submission error occurred.");
  } finally {
    setSubmitting(false);
  }
};

  if (fetching) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gray-400" size={40} /></div>;
  if (!business) return <div className="p-20 text-center text-red-500 font-medium">{errorMsg || "Workspace data configuration error targets missing."}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold mb-6 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#007185] bg-teal-50 px-2.5 py-1 rounded-md">{business.category}</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2 mb-1">{business.name}</h1>
        <p className="text-gray-500 font-medium">📍 {business.location}</p>
      </div>

      <form onSubmit={handleReviewSubmit} className="bg-white p-8 md:w-[60vw] rounded-2xl border border-gray-200 shadow-xl space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block font-bold text-gray-800 text-lg mb-2">Your overall rating score</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const isActive = hoverRating ? starIndex <= hoverRating : starIndex <= rating;
              return (
                <button
                  type="button"
                  key={starIndex}
                  onClick={() => setRating(starIndex)}
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform transform active:scale-90 focus:outline-none"
                >
                  <Star 
                    size={36} 
                    className={`transition-colors duration-150 ${
                      isActive ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                    }`} 
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-lg mb-2">Write your review</label>
          <textarea
            rows={6}
            placeholder="Tell us about your experience with this establishment..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007185] focus:border-transparent font-medium text-gray-700 resize-none transition-all"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full text-white font-bold py-4 rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2
            ${submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#007185] hover:bg-[#005f70]'}`}
        >
          {submitting && <Loader2 className="animate-spin" size={18} />}
          {submitting ? 'Posting Review...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}