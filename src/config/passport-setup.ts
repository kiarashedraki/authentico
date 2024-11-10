// src/config/passport-setup.ts
import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        // Ensure profile.emails is defined and contains at least one email address
        const email = profile.emails?.[0]?.value || '';
        if (!email) {
          return done(new Error('No email found in Google profile'), false);
        }

        // Create a new user
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: email,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.password) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch
        ? done(null, user)
        : done(null, false, { message: 'Incorrect email or password.' });
    } catch (err) {
      return done(err);
    }
  })
);

// JWT Strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.sub);
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Remove serializeUser and deserializeUser since sessions are not used
