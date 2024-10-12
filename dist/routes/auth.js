"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
// Google login route
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
// Google callback route
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Redirect to profile page on successful authentication
    res.redirect('/profile');
});
// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
exports.default = router;
