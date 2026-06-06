import express, { Request, Response, Router, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signUp, login } from '../controllers/authController';

const router: Router = express.Router();
const JWT_SECRET: string = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const FRONTEND_URL: string = process.env.FRONTEND_URL || 'http://localhost:3000';

// Define the exact shape of the user structure returned by your Passport Google callback
interface GoogleUser {
  id: string;
  email: string;
  firstName: string;
}

// --- EXISTING EMAIL/PASSWORD CREDENTIAL ROUTES ---
router.post('/signup', signUp);
router.post('/login', login);

// --- OAUTH INITIALIZATION ROUTE ---
// @route   GET /auth/google
// @desc    Redirects the user to Google's secure login consent screen with dynamic return target
router.get(
  '/google',
  (req: Request, res: Response, next: NextFunction) => {
    // Capture the target destination (e.g., '/business'), defaulting to root home path
    const redirectTo = (req.query.redirectTo as string) || '/';

    // Use Passport's secure state feature to forward the destination to Google
    passport.authenticate('google', { 
      scope: ['profile', 'email'], 
      session: false,
      state: redirectTo 
    })(req, res, next);
  }
);

// --- OAUTH CALLBACK COMPLETION ROUTE ---
// @route   GET /auth/google/callback
// @desc    Google returns the user here after successful consent with state parameter preserved
router.get(
  '/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    // 1. Capture the destination tracking code returned cleanly from Google's query parameters first
    const targetDestination = (req.query.state as string) || '/';

    // 2. Use a custom callback pattern to control failures cleanly without displaying intermediate raw text pages
    passport.authenticate('google', { session: false }, (err: any, user: unknown) => {
      if (err || !user) {
        console.error("Google passport authentication failed:", err);
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }

      // Type-safe extraction: Cast user payload to our interface context safely
      const googleUser = user as GoogleUser;

      try {
        // 3. Generate your app's JWT token for the user session using the typed properties
        const token = jwt.sign(
          { 
            id: googleUser.id, 
            email: googleUser.email,
            name: googleUser.firstName 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        // 4. Securely deliver the token AND the return location back to your Next.js application frontend
        // Note: Modified back to route to your application route root context matching your previous frontend structures
        return res.redirect(
          `${FRONTEND_URL}?token=${token}&redirectTo=${encodeURIComponent(targetDestination)}`
        );
      } catch (tokenError) {
        console.error("JWT creation error within OAuth context:", tokenError);
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }
    })(req, res, next);
  }
);

export default router;