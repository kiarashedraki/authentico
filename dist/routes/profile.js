"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var router = express_1.default.Router();
// Profile route, only accessible when logged in
router.get('/', passport_1.default.authenticate('jwt', { session: false }), function (req, res) {
    var user = req.user;
    if (user) {
        res.send("Hello ".concat(user.displayName));
    }
    else {
        res.send('User is not authenticated.');
    }
});
exports.default = router;
