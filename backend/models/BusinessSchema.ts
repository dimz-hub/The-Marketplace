import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Interface for individual review entries
export interface IReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// 🚀 Interface for individual menu entries
export interface IMenuItem {
  name: string;
  price: string;
}

// 2. Interface for TypeScript Business Document
export interface IBusiness extends Document {
  id: string; 
  userId: string; 
  name: string;
  category: 'Restaurants' | 'Fashion' | 'Dry Food' | 'Logistics' | 'Home Services';
  location: string;
  email: string;
  phoneNumber: number | string; 
  openTime: string;
  closeTime: string;
  description?: string;
  websiteLink?: string; 
  images: string[];
  reviews: IReview[];   // 🚀 Added sub-document layout reference array
  rating: number;       // 🚀 Enforced number type to match aggregate calculation scripts
  reviewCount: number;  // 🚀 Tracks overall numeric counts
  menu?: IMenuItem[];   // 🚀 Added dynamic restaurant menu interface reference
  tags?: string[];      // 保留 Optional user tags array parameter
  createdAt: Date;
}

// 3. Schema Definition
const BusinessSchema: Schema<IBusiness> = new Schema({
  userId: {
    type: String, 
    required: true
  },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Restaurants', 'Fashion', 'Dry Food', 'Logistics', 'Home Services'] 
  },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  openTime: { type: String, required: true }, 
  closeTime: { type: String, required: true },
  description: { type: String },
  websiteLink: { type: String, default: "" }, 
  images: { 
    type: [String], 
    default: [] 
  },
  // 🚀 Integrated Reviews sub-document payload tree structure
  reviews: [
    {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  // 🚀 Integrated dynamic Restaurant Menu matrix data sub-array layout
  menu: [
    {
      name: { type: String, required: true, trim: true },
      price: { type: String, required: true, trim: true }
    }
  ],
  rating: { type: Number, default: 0 },       // Defaulted to 0 for initial registration
  reviewCount: { type: Number, default: 0 },  // Defaulted to 0 for tracking integrity
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
}, 
{ 
  // These options ensure 'id' is included when sending data to the frontend
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false 
});

// 4. Indexes
BusinessSchema.index({ category: 1 });
BusinessSchema.index({ userId: 1 }); 

// 5. Model Export
const Business: Model<IBusiness> = mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;