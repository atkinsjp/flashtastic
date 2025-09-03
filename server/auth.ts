import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import { Express } from 'express';
import { storage } from './storage';
import type { User } from '@shared/schema';

// Configure session middleware
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

// Configure Passport strategies
export function configurePassport() {
  // Local Strategy (email/password)
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'No user found with that email' });
      }

      if (!user.passwordHash) {
        return done(null, false, { message: 'Please sign in with Google or reset your password' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Google OAuth Strategy - only configure if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use('google', new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await storage.getUserByGoogleId(profile.id);
        
        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
        if (existingUser) {
          // Link the Google account to existing user
          const updatedUser = await storage.updateUser(existingUser.id, {
            googleId: profile.id,
            authProvider: 'google'
          });
          return done(null, updatedUser);
        }

        // Create new user with Google profile
        const newUser = await storage.createUser({
          name: profile.displayName || profile.name?.givenName || 'Student',
          email: profile.emails?.[0]?.value || '',
          username: profile.emails?.[0]?.value?.split('@')[0] || `user_${profile.id}`,
          googleId: profile.id,
          authProvider: 'google',
          grade: '2', // Default grade, can be updated later
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }));
  }

  // Serialize/deserialize user for sessions
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Setup authentication middleware
export function setupAuth(app: Express) {
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  
  configurePassport();
}

// Authentication middleware
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}

export function optionalAuth(req: any, res: any, next: any) {
  // Always continue, but user will be available if authenticated
  next();
}