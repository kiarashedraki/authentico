import express, { Request, Response } from 'express';
import passport from 'passport';
import { IUser } from '../models/User';

const router = express.Router();

// Profile route, only accessible when logged in
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response): void => {
    const user = req.user as IUser;
    if (user) {
      res.send(`Hello ${user.displayName}`);
    } else {
      res.send('User is not authenticated.');
    }
  }
);

export default router;
