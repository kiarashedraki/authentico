import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = express.Router();

// Google login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    // Redirect to profile page on successful authentication
    res.redirect('/profile');
  }
);

// Logout route
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;
