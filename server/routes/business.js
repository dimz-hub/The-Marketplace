const express = require('express');
const { searchBusinesses } = require('../contollers/businessController.js');
const router = express.Router();
const Business = require('../models/businessModel.js');

// Route: GET /search?find_desc=Restaurants
router.get('/search', searchBusinesses);

module.exports = router;