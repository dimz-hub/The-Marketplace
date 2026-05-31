import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Keep your custom interfaces defined here, expanded with the name tracker payload
interface UserJwtPayload {
  id: string;
  email: string;
  name?: string; // 🚀 Added to match dynamic token payloads
}

interface AuthenticatedRequest extends Request {
  user?: UserJwtPayload;
}

// 2. Standardized protect layout handling Express Router execution stacks smoothly
export const protect = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void | Response> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your_secret_key'
      ) as UserJwtPayload;

      // 3. Cast the req as AuthenticatedRequest internally, cleanly appending the name payload
      (req as AuthenticatedRequest).user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name // 🚀 CRITICAL FIX: Extraction node ensuring name maps downstream to req.user.name
      };

      return next(); // Hand over to the next middleware/controller seamlessly
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ success: false, message: 'Not authorized, token validation failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized session context missing.' });
  }
};