import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Request } from 'express';
// Import your MongoDB/Mongoose User Model here
// import User from '../models/User'; 

// 🚀 FIXED: Dynamic callback determination handles both standard naming fallbacks
const BACKEND_BASE_URL = process.env.API_BASE_URL || process.env.BACKEND_BASE_URL || 'http://localhost:4000';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      // Uses the dynamic environment variable instead of hardcoded localhost
      callbackURL: `${BACKEND_BASE_URL}/auth/google/callback`,
      passReqToCallback: true,
      proxy: true, // 🚀 CRITICAL FIX: Forces Passport to use HTTPS behind Render's reverse proxy load balancers
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // 1. Check if user already exists in your database by email
        // let user = await User.findOne({ email });

        // 2. If user doesn't exist, create a new one in your database
        // if (!user) {
        //   user = await User.create({
        //     firstName: profile.name?.givenName || 'Google User',
        //     lastName: profile.name?.familyName || '',
        //     email: email,
        //     role: 'user', // Default role
        //     zipcode: '',  // Can be filled out later by the user
        //     googleId: profile.id // Good to store to link accounts
        //   });
        // }

        // For now, passing a mock user structure matching your frontend needs
        const mockUser = {
          id: profile.id,
          email: email,
          firstName: profile.name?.givenName || 'User'
        };

        return done(null, mockUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  ) // 🚀 FIXED HERE: Closing parenthesis for the GoogleStrategy constructor
);

export default passport;