require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport-setup');  // Import Passport config

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);        // Authentication routes
app.use('/profile', profileRoutes);  // Profile routes

// Home route
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
