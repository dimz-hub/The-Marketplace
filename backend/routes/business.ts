import multer from 'multer';
import express, { Router } from 'express';
import { searchBusinesses, addBusiness } from '../controllers/businessController';
const upload = multer({ dest: 'uploads/' })

const router: Router = express.Router();

/**
 * Route: GET /business/search
 * query params: find_desc, tag, location, rating, open_now
 */
router.get('/search', searchBusinesses);
router.post('/register', upload.array('images', 5), addBusiness);

export default router;