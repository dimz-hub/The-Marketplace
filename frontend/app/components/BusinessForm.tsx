"use client"
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { ImagePlus, X } from 'lucide-react'; // Import icons for better UI
import FieldsetGroup from './Fieldset';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  category: string;
  location: string;
  openTime: string;
  closeTime: string;
  description: string;
}

const BusinessRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phoneNumber: '', category: '',
    location: '', openTime: '', closeTime: '', description: ''
  });

  // --- NEW STATE FOR IMAGES ---
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const categories = ['Restaurants', 'Fashion', 'Dry Food', 'Logistics', 'Home Services'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- HANDLE IMAGE SELECTION ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      // Create local URLs for previewing images
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    // --- USE FORMDATA FOR FILE UPLOAD ---
    const data = new FormData();
    
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append images (the key 'images' must match upload.array('images') in backend)
    selectedFiles.forEach((file) => {
      data.append('images', file);
    });

    try {
      const response = await axios.post('http://localhost:4000/business/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        setStatusMsg({ type: 'success', text: 'Business registered successfully!' });
        setFormData({
          name: '', email: '', phoneNumber: '', category: '',
          location: '', openTime: '', closeTime: '', description: ''
        });
        setSelectedFiles([]);
        setPreviews([]);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Something went wrong';
      setStatusMsg({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-[-40px] relative z-20">
      
      {statusMsg && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300 ${
          statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {statusMsg.text}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* --- IMAGE UPLOAD SECTION --- */}
      

        {/* --- EXISTING FIELDS --- */}
        <FieldsetGroup label="Your business name">
          <input
            type="text" name="name" className="w-full outline-none px-1 text-lg bg-transparent"
            value={formData.name} onChange={handleChange} placeholder="Enter name" required
          />
        </FieldsetGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldsetGroup label="Email address">
            <input type="email" name="email" className="w-full outline-none bg-transparent"
              value={formData.email} onChange={handleChange} required />
          </FieldsetGroup>

          <FieldsetGroup label="Phone Number">
            <input type="text" name="phoneNumber" className="w-full outline-none bg-transparent"
              value={formData.phoneNumber} onChange={handleChange} required />
          </FieldsetGroup>
        </div>

        <FieldsetGroup label="Category">
          <select name="category" className="w-full outline-none bg-transparent cursor-pointer"
            value={formData.category} onChange={handleChange} required >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FieldsetGroup>

        <FieldsetGroup label="Location">
          <input type="text" name="location" className="w-full outline-none bg-transparent"
            value={formData.location} onChange={handleChange} required />
        </FieldsetGroup>

        <div className="grid grid-cols-2 gap-4">
          <FieldsetGroup label="Open Time">
            <input type="time" name="openTime" className="w-full outline-none bg-transparent"
              value={formData.openTime} onChange={handleChange} required />
          </FieldsetGroup>

          <FieldsetGroup label="Close Time">
            <input type="time" name="closeTime" className="w-full outline-none bg-transparent"
              value={formData.closeTime} onChange={handleChange} required />
          </FieldsetGroup>
        </div>

        <FieldsetGroup label="Business Description">
          <textarea name="description" rows={3} className="w-full outline-none bg-transparent resize-none"
            value={formData.description} onChange={handleChange} ></textarea>
        </FieldsetGroup>
          <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Business Images</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {previews.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {/* Upload Trigger */}
            <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#007185] hover:bg-gray-50 cursor-pointer transition-colors">
              <ImagePlus className="text-gray-400 mb-1" size={24} />
              <span className="text-[10px] text-gray-500 font-medium">Add Photo</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className={`w-full text-white font-bold py-4 rounded-lg transition-all shadow-md mt-4 active:scale-[0.98]
            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#007185] hover:bg-[#005f70]'}`}
        >
          {loading ? 'Processing...' : 'Register Business'}
        </button>
      </form>
    </div>
  );
};

export default BusinessRegistration;