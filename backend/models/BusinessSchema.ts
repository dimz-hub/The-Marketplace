import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Update the Interface to include images
export interface IBusiness extends Document {
  name: string;
  category: 'Restaurants' | 'Fashion' | 'Dry Food' | 'Logistics' | 'Home Services';
  location: string;
  email: string;
  phoneNumber: number | string; 
  openTime: string;
  closeTime: string;
  description?: string;
  images: string[]; // <--- ADD THIS: Array of image paths/URLs
  createdAt: Date;
}

// 2. Update the Schema to include images
const BusinessSchema: Schema<IBusiness> = new Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Restaurants', 'Fashion', 'Dry Food', 'Logistics', 'Home Services'] 
  },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { 
    type: Schema.Types.Mixed, // Changed to Mixed to support both string and number safely
    required: true 
  },
  openTime: { type: String, required: true }, 
  closeTime: { type: String, required: true },
  description: { type: String },
  
  // --- ADD THIS FIELD ---
  images: { 
    type: [String], 
    default: [] // Ensures it's always an array, even if empty
  },

  createdAt: { type: Date, default: Date.now }
});

BusinessSchema.index({ category: 1 });

const Business: Model<IBusiness> = mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;