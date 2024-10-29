"use strict";
// src/routes/auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importDefault(require("../models/User"));
var router = express_1.default.Router();
// Register route
router.post('/register', function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password, displayName = _a.displayName;
    User_1.default.findOne({ email: email })
        .then(function (existingUser) {
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return; // Stop further execution if user exists
        }
        bcrypt_1.default
            .hash(password, 10)
            .then(function (hashedPassword) {
            var newUser = new User_1.default({
                email: email,
                password: hashedPassword,
                displayName: displayName,
            });
            newUser
                .save()
                .then(function () {
                res.status(201).json({ message: 'User registered successfully' });
            })
                .catch(function (err) {
                res.status(500).json({ message: 'Error saving new user', error: err });
            });
        })
            .catch(function (err) {
            res.status(500).json({ message: 'Error hashing password', error: err });
        });
    })
        .catch(function (err) {
        res.status(500).json({ message: 'Error checking existing user', error: err });
    });
});
// Login route
router.post('/login', function (req, res, next) {
    passport_1.default.authenticate('local', { session: false }, function (err, user, info) {
        if (err || !user) {
            return res.status(400).json({ message: (info === null || info === void 0 ? void 0 : info.message) || 'Login failed' });
        }
        var payload = {
            sub: user.id,
            displayName: user.displayName,
            email: user.email,
        };
        var token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: token });
    })(req, res, next);
});
// Google login route
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
// Google callback route
router.get('/google/callback', function (req, res, next) {
    passport_1.default.authenticate('google', { failureRedirect: '/', session: false }, function (err, user, info) {
        if (err || !user) {
            return res.redirect('/');
        }
        var payload = {
            sub: user.id,
            displayName: user.displayName,
            email: user.email,
        };
        var token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token: token,
            user: {
                displayName: user.displayName,
                email: user.email
            }
        });
    })(req, res, next);
});
exports.default = router;
