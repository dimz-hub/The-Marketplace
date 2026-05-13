import { Request, Response } from 'express';
import Business, {IBusiness} from '../models/BusinessSchema';

// Define the shape of the incoming query parameters
interface BusinessSearchParams {
  find_desc?: string;
  tag?: string;
  location?: string;
  rating?: string;
  open_now?: string;
}

// export const searchBusinesses = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // 1. Get parameters with explicit typing
//     const { find_desc, tag, location, rating, open_now } = req.query as BusinessSearchParams;

//     // 2. Initialize a query object
//     // Using 'any' here allows us to build the MongoDB query dynamically
//     let query: any = {};

//     // Filter by Category
//    // Filter by Category OR Name (Common Search Logic)
// if (find_desc) {
//   query.$or = [
//     { category: { $regex: find_desc, $options: 'i' } },
//     { name: { $regex: find_desc, $options: 'i' } }
//   ];
// }

//     // Filter by Location
//     if (location) {
//       query.location = { $regex: new RegExp(location, 'i') };
//     }

//     // Filter by Minimum Rating
//     if (rating) {
//       query.rating = { $gte: Number(rating) };
//     }

//     // Filter by Tags
//     if (tag) {
//       query.tags = { $in: [new RegExp(tag, 'i')] };
//     }

//     // Filter by "Open Now"
//     if (open_now === 'true') {
//       const currentTime = new Date().toLocaleTimeString('en-GB', { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       }); 

//       query.openTime = { $lte: currentTime };
//       query.closeTime = { $gte: currentTime };
//     }

//     // 3. Execute the search
//     const results = await Business.find(query).sort({ rating: -1 });

//     res.status(200).json({
//       success: true,
//       count: results.length,
//       filtersApplied: query,
//       data: results
//     });

//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     res.status(500).json({ success: false, error: errorMessage });
//   }
// };

export const searchBusinesses = async (req: Request, res: Response): Promise<void> => {
  try {
    // We only extract find_desc now
    const { find_desc } = req.query as BusinessSearchParams;

    let query: any = {};

    // Filter strictly by Category (Case-insensitive)
    if (find_desc) {
      query.category = { $regex: find_desc, $options: 'i' };
    }

    // Log this to your terminal to verify what Mongo is looking for
    console.log("Search Query:", query);

    const results = await Business.find(query).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error: unknown) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};






export const addBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extract files from Multer
    // Since we used upload.array('images'), files are in req.files
    const files = req.files as Express.Multer.File[];
    
    // 2. Map file objects to get their storage paths
    const imagePaths = files ? files.map(file => file.path) : [];

    // 3. Extract text fields from req.body
    const {
      name,
      category,
      location,
      email,
      phoneNumber,
      openTime,
      closeTime,
      description
    } = req.body;

    // 4. Basic Validation (Including image check if you want images to be required)
    if (!name || !category || !location || !email || !phoneNumber || !openTime || !closeTime) {
      res.status(400).json({ 
        success: false, 
        message: 'Please provide all required text fields.' 
      });
      return;
    }

    // 5. Create the business instance including the images array
    const newBusiness = new Business({
      name,
      category,
      location,
      email,
      phoneNumber,
      openTime,
      closeTime,
      description,
      images: imagePaths // Added the array of strings here
    });

    // 6. Save to MongoDB
    const savedBusiness = await newBusiness.save();

    res.status(201).json({
      success: true,
      data: savedBusiness,
      message: 'Business registered successfully with images!'
    });

  } catch (error: unknown) {
    console.error('Error adding business:', error);

    // 7. Error Handling
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
        return;
      }
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
    }
  }
};