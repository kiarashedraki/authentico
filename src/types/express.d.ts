// src/types/express.d.ts

import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: User;
    }
  }
}

export {};
