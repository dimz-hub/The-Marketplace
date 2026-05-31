import express, { Request, Response, Router, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signUp, login } from '../controllers/authController';

const router: Router = express.Router();
const JWT_SECRET: string = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

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
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/login?error=oauth_failed', 
    session: false 
  }),
  (req: Request, res: Response) => {
    // Type-safe extraction: Cast req.user to our custom interface instead of 'any'
    const user = req.user as GoogleUser | undefined;

    if (!user) {
      return res.redirect('http://localhost:3000/login?error=no_user');
    }

    // Passport automatically parses Google's state response parameter and drops it into req.query.state
    const targetDestination = (req.query.state as string) || '/';

    // Generate your app's JWT token for the user session using the typed properties
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Securely deliver the token AND the return location back to your Next.js application frontend
    res.redirect(
      `http://localhost:3000/login-success?token=${token}&redirectTo=${encodeURIComponent(targetDestination)}`
    );
  }
);

export default router;