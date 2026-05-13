const Business = require('../models/businessModel')
const mongoose = require('mongoose')

// get all businesses
const searchBusinesses = async (req, res) => {
  try {
    // 1. Get parameters from the URL
    const { find_desc, tag, location, rating, open_now } = req.query;

    // 2. Initialize an empty query object
    let query = {};

    // Filter by Category
    if (find_desc) {
      query.category = { $regex: new RegExp(find_desc, 'i') };
    }

    // Filter by Location
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    // Filter by Minimum Rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Filter by Tags
    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    // --- NEW: Filter by "Open Now" ---
    if (open_now === 'true') {
      const currentTime = new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }); 

      // Finds businesses where: 
      // Current Time is greater than or equal to Open Time
      // AND Current Time is less than or equal to Close Time
      query.openTime = { $lte: currentTime };
      query.closeTime = { $gte: currentTime };
    }
    // --------------------------------

    // 3. Execute the search with Mongoose
    const results = await Business.find(query).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      filtersApplied: query,
      data: results
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  searchBusinesses
}