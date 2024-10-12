"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
// Profile route, only accessible when logged in
router.get('/', isAuthenticated, (req, res) => {
    if (req.user) {
        res.send(`Hello ${req.user.displayName}`);
    }
    else {
        res.send('User is not authenticated.');
    }
});
exports.default = router;
