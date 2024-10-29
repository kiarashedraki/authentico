"use strict";
// src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var db_1 = __importDefault(require("./config/db"));
require("./config/passport-setup");
var auth_1 = __importDefault(require("./routes/auth"));
var profile_1 = __importDefault(require("./routes/profile"));
var app = (0, express_1.default)();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.default)();
// Initialize Passport (no sessions)
app.use(passport_1.default.initialize());
// Routes
app.use('/auth', auth_1.default); // Authentication routes
app.use('/profile', profile_1.default); // Profile routes
// Home route
app.get('/', function (req, res) {
    res.send('Home Page');
});
// Server listener
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
exports.default = app;
