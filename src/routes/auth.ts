// src/routes/auth.ts

import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const router = express.Router();

// Register route
router.post('/register', (req: Request, res: Response): void => {
  const { email, password, displayName } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return; // Stop further execution if user exists
      }

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const newUser = new User({
            email,
            password: hashedPassword,
            displayName,
          });

          newUser
            .save()
            .then(() => {
              res.status(201).json({ message: 'User registered successfully' });
            })
            .catch((err) => {
              res.status(500).json({ message: 'Error saving new user', error: err });
            });
        })
        .catch((err) => {
          res.status(500).json({ message: 'Error hashing password', error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error checking existing user', error: err });
    });
});

// Login route
router.post('/login', (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate(
    'local',
    { session: false },
    (err: Error | null, user: IUser | false, info: any) => {
      if (err || !user) {
        return res.status(400).json({ message: info?.message || 'Login failed' });
      }

      const payload = {
        sub: user.id,
        displayName: user.displayName,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.json({ token });
    }
  )(req, res, next);
});

// Google login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google callback route
router.get(
  '/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'google',
      { failureRedirect: '/', session: false },
      (err: any, user: IUser | false, info: any) => {
        if (err || !user) {
          return res.redirect('/');
        }

        const payload = {
          sub: user.id,
          displayName: user.displayName,
          email: user.email,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({
          token,
          user: {
            displayName: user.displayName,
            email: user.email
          }
        });
      }
    )(req, res, next);
  }
);


export default router;
