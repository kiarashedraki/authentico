// src/app.ts

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import passport from 'passport';

import connectDB from './config/db';
import './config/passport-setup';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize Passport (no sessions)
app.use(passport.initialize());

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
