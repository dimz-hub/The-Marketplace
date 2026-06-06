import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport'; // 🚀 Added to process the passport lifecycle handlers

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

// ==========================================
// 🚀 INTEGRATED: GOOGLE OAUTH CONTROLLERS
// ==========================================

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

/**
 * Optional Initiator route controller:
 * In case a client directly navigates to your backend endpoint URL instead of utilizing the client-side configuration.
 */
export const initiateGoogleAuth = (req: Request, res: Response, next: NextFunction) => {
  const redirectTo = (req.query.redirectTo as string) || '/';
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: redirectTo, // Pass intended route path context to Google
  })(req, res, next);
};

/**
 * 🚀 Critical Callback Handler Integration:
 * Intercepts the profile payload returned by Passport from Google, signs a functional JWT token,
 * reads the frontend tracking state, and sends the browser smoothly back to your Next.js application frame.
 */
export const handleGoogleCallback = (req: Request, res: Response, next: NextFunction) => {
  // Capture the destination path context ('state') returned back safely by Google's redirect query
  const clientDestination = (req.query.state as string) || '/';

  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      console.error("Google passport authentication failed:", err);
      // Cleanly fallback to your login screen and supply an error visual parameter string
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      // Create your session payload token utilizing the passport resolved dataset
      const token = jwt.sign(
        { 
          id: user.id || user._id, 
          email: user.email,
          name: user.firstName || user.name 
        },
        JWT_SECRET,
        { expiresIn: '7d' } // Session lifetime parameter configuration
      );

      // Instantly bounce the user straight back into your clean Next.js app wrapper setup!
      // This eliminates seeing an intermediate blank/loading Render domain template screen.
      return res.redirect(
        `${FRONTEND_URL}?token=${token}&redirectTo=${encodeURIComponent(clientDestination)}`
      );
    } catch (tokenError) {
      console.error("JWT creation error within OAuth context:", tokenError);
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }
  })(req, res, next);
};