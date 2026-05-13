const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Category allows us to filter the data later
  category: { 
    type: String, 
    required: true, 
    enum: ['Restaurants', 'Fashion', 'Dry Food', 'Logistics', 'Home Services'] 
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  location: { type: String, required: true },
  openTime: { type: String, required: true }, // e.g., "09:00 AM"
  closeTime: { type: String, required: true }, // e.g., "10:00 PM"
  icon: { type: String }, // URL to the image/icon
  description: { type: String },
  tags: [{ type: String }], // Array of strings for searchability
  createdAt: { type: Date, default: Date.now }
});

// We add an index to 'category' to make searches lightning fast
BusinessSchema.index({ category: 1 });

const Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;