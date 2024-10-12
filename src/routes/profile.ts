import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Profile route, only accessible when logged in
router.get('/', isAuthenticated, (req: Request, res: Response): void => {
  if (req.user) {
    res.send(`Hello ${req.user.displayName}`);
  } else {
    res.send('User is not authenticated.');
  }
});

export default router;
