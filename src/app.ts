import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';

import connectDB from './config/db';
import './config/passport-setup';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';

const app = express();

// Connect to MongoDB
connectDB();

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/profile', profileRoutes); // Profile routes

// Home route
app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
