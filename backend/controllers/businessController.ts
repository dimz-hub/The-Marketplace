import { Request, Response } from 'express';
import Business from '../models/BusinessSchema';

// --- TS INTERFACES ---

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string; 
  };
}

interface MongoQueryOperators {
  $regex?: string;
  $options?: string;
  $gte?: number | string;
  $lte?: number | string;
  $in?: RegExp[];
}

interface BusinessSearchParams {
  find_desc?: string;
  tag?: string;
  location?: string;
  rating?: string;
  open_now?: string;
}

interface AddBusinessBody {
  name: string;
  category: 'Restaurants' | 'Fashion' | 'Dry Food' | 'Logistics' | 'Home Services';
  location: string;
  email: string;
  phoneNumber: string;
  openTime: string;
  closeTime: string;
  description?: string;
  websiteLink?: string;
  menu?: string; // 🚀 Declared incoming menu schema string from multi-part upload tracking
  [key: string]: any; 
}

// --- CONTROLLERS ---

export const getSearchSuggestions = async (
  req: Request, 
  res: Response
): Promise<void | Response> => {
  try {
    const { query } = req.query;

    if (!query || String(query).trim().length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    const searchRegex = new RegExp(String(query).trim(), 'i');

    const suggestions = await Business.find({
      $or: [
        { name: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ]
    })
    .select('name category location')
    .limit(5);

    return res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error: unknown) {
    console.error('Error fetching suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
};

export const searchBusinesses = async (
  req: Request, 
  res: Response
): Promise<void | Response> => {
  try {
    const { find_desc, tag, location, rating, open_now } = req.query as unknown as BusinessSearchParams;
    const query: Record<string, string | number | RegExp | boolean | MongoQueryOperators | Array<Record<string, MongoQueryOperators>> | undefined> = {};

    if (find_desc) {
      query.$or = [
        { category: { $regex: find_desc, $options: 'i' } },
        { name: { $regex: find_desc, $options: 'i' } }
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }
    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }
    if (open_now === 'true') {
      const currentTime = new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }); 
      query.openTime = { $lte: currentTime };
      query.closeTime = { $gte: currentTime };
    }

    const results = await Business.find(query).sort({ rating: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      filtersApplied: query,
      data: results
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
};

// Create / Register Business Controller
export const addBusiness = async (
  req: Request, 
  res: Response
): Promise<void | Response> => {
  try {
    const authReq = req as AuthenticatedRequest; 

    const files = authReq.files as Express.Multer.File[];
    const imagePaths = files ? files.map((file) => file.path) : [];

    const {
      name,
      category,
      location,
      email,
      phoneNumber,
      openTime,
      closeTime,
      description,
      websiteLink,
      menu // 🚀 Incoming dynamic menu data string sequence from form parser payload
    } = authReq.body as AddBusinessBody;

    if (!authReq.user || !authReq.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized session context missing.' 
      });
    }

    if (!name || !category || !location || !email || !phoneNumber || !openTime || !closeTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required text fields.' 
      });
    }

    // 🚀 Handle conversion fallback array safely parsing JSON strings
    let parsedMenu = [];
    if (category === 'Restaurants' && menu) {
      try {
        parsedMenu = typeof menu === 'string' ? JSON.parse(menu) : menu;
      } catch (err) {
        console.error("Menu parse operation failure during registration workflow logic mappings:", err);
      }
    }

    const newBusiness = new Business({
      userId: authReq.user.id, 
      name,
      category,
      location,
      email,
      phoneNumber,
      openTime,
      closeTime,
      description,
      websiteLink: websiteLink || "", 
      images: imagePaths,
      menu: parsedMenu // 🚀 Save safe structured menu data parameters to DB model
    });

    const savedBusiness = await newBusiness.save();

    return res.status(201).json({
      success: true,
      data: savedBusiness,
      message: 'Business registered successfully with images!'
    });

  } catch (error: unknown) {
    console.error('Error adding business:', error);
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: error.message });
    } 
    return res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
  }
};

// Get Business By ID Controller
export const getBusinessById = async (
  req: Request, 
  res: Response
): Promise<void | Response> => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
       return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, data: business });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
};

// Update Business Controller
export const updateBusiness = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const updateFields = { ...authReq.body };

    if (!authReq.user || !authReq.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized session context missing.' 
      });
    }

    let business = await Business.findById(id); 
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business workspace not found.' });
    }

    if (business.userId !== authReq.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to modify this business.' 
      });
    }

    const files = authReq.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const newImages = files.map((file) => file.path);
      business.images = [...business.images, ...newImages];
    }

    if (authReq.body.deletedImages) {
      try {
        const deleted: string[] = JSON.parse(authReq.body.deletedImages);
        business.images = business.images.filter((img) => !deleted.includes(img));
      } catch (e) {
        console.error("Failed to parse deletedImages payload safely");
      }
    }

    const allowedFields: Array<keyof AddBusinessBody> = [
      'name', 'email', 'phoneNumber', 'category', 'location', 
      'openTime', 'closeTime', 'description', 'websiteLink'
    ];

    allowedFields.forEach((field) => {
      if (updateFields[field] !== undefined) {
        (business as any)[field] = updateFields[field];
      }
    });

    // 🚀 Handle conversion payload inside patch/update routines context updates cleanly
    if (updateFields.category === 'Restaurants' && updateFields.menu) {
      try {
        (business as any).menu = typeof updateFields.menu === 'string' 
          ? JSON.parse(updateFields.menu) 
          : updateFields.menu;
      } catch (e) {
        console.error("Failed handling incoming modifications menu strings payload array structures parsing parsing logs", e);
      }
    } else if (updateFields.category !== 'Restaurants') {
      // Clear menu if category is changed away from Restaurants
      (business as any).menu = [];
    }

    const updatedBusiness = await business.save();

    return res.status(200).json({
      success: true,
      data: updatedBusiness,
      message: 'Business updated successfully!'
    });

  } catch (error: unknown) {
    console.error('Error patching business:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred.';
    return res.status(500).json({ success: false, error: errorMessage });
  }
};

// POST /business/:id/review 
export const addBusinessReview = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const { rating, comment, userName } = req.body; 

    if (!authReq.user || !authReq.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized profile session missing.' });
    }

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide both rating and review comment.' });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business workspace entity not found.' });
    }

    const resolvedReviewerName = authReq.user.name || userName || "Anonymous Reviewer";

    const newReview = {
      userId: authReq.user.id,
      userName: resolvedReviewerName, 
      rating: Number(rating),
      comment: comment,
      createdAt: new Date()
    };

    business.reviews.push(newReview);
    business.reviewCount = business.reviews.length;
    
    const totalRatingSum = business.reviews.reduce((sum, item) => sum + item.rating, 0);
    business.rating = Math.round((totalRatingSum / business.reviewCount) * 10) / 10;

    await business.save();

    return res.status(201).json({
      success: true,
      message: 'Review added successfully!',
      data: business
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error adding comments';
    return res.status(500).json({ success: false, error: msg });
  }
};