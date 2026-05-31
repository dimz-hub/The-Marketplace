import multer from 'multer';
import express, { Router } from 'express';
import { searchBusinesses, addBusiness, getBusinessById, updateBusiness, getSearchSuggestions, addBusinessReview } from '../controllers/businessController';
import { protect } from '../middleware/authMiddleware'; // 👈 1. Import your authentication protector middleware

const upload = multer({ dest: 'uploads/' });
const router: Router = express.Router();

/**
 * Route: GET /business/search
 * query params: find_desc, tag, location, rating, open_now
 */
router.get('/search', searchBusinesses);
router.get('/suggestions', getSearchSuggestions);

// 2. CRITICAL INTERCEPTION ORDER: 
// First protect checks the JWT -> Then multer parses images -> Finally addBusiness runs with req.user populated!
router.post('/register', protect, upload.array('images', 5), addBusiness);
router.patch('/update/:id', protect, upload.array('images', 5), updateBusiness);

router.get('/:id', getBusinessById);
router.post('/:id/review', protect, addBusinessReview);

export default router;