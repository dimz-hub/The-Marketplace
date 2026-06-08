import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';

// Import your MongoDB/Mongoose User Model here
// import User from '../models/User'; 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      // 🚀 FIXED: Hardcoded absolute URL completely eliminates 'redirect_uri_mismatch' errors on production
      callbackURL: 'https://the-marketplace-zjjl.onrender.com/auth/google/callback',
      proxy: true, // 🚀 CRITICAL FIX: Forces Passport to preserve HTTPS headers behind Render's reverse proxies
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
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

        // Passing a mock user structure matching your frontend needs
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
  )
);

export default passport;