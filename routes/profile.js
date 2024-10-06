const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Profile route, only accessible when logged in
router.get('/', isAuthenticated, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

module.exports = router;
