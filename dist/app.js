"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("./config/db"));
require("./config/passport-setup");
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const app = (0, express_1.default)();
// Connect to MongoDB
(0, db_1.default)();
// Configure session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.use('/auth', auth_1.default); // Authentication routes
app.use('/profile', profile_1.default); // Profile routes
// Home route
app.get('/', (req, res) => {
    res.send('Home Page');
});
// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
