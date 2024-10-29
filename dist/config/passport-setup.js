"use strict";
// src/config/passport-setup.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_google_oauth20_1 = require("passport-google-oauth20");
var passport_local_1 = require("passport-local");
var passport_jwt_1 = require("passport-jwt");
var bcrypt_1 = __importDefault(require("bcrypt"));
var User_1 = __importDefault(require("../models/User"));
// Google OAuth Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, function (accessToken, refreshToken, profile, done) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, email, newUser, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User_1.default.findOne({ googleId: profile.id })];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, done(null, existingUser)];
                }
                email = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || '';
                if (!email) {
                    return [2 /*return*/, done(new Error('No email found in Google profile'), false)];
                }
                newUser = new User_1.default({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: email,
                });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _c.sent();
                return [2 /*return*/, done(null, newUser)];
            case 3:
                err_1 = _c.sent();
                return [2 /*return*/, done(err_1, false)];
            case 4: return [2 /*return*/];
        }
    });
}); }));
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, function (email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isMatch, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user || !user.password) {
                    return [2 /*return*/, done(null, false, { message: 'Incorrect email or password.' })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                isMatch = _a.sent();
                return [2 /*return*/, isMatch
                        ? done(null, user)
                        : done(null, false, { message: 'Incorrect email or password.' })];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, done(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); }));
// JWT Strategy
var opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, function (jwt_payload, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById(jwt_payload.sub)];
            case 1:
                user = _a.sent();
                return [2 /*return*/, user ? done(null, user) : done(null, false)];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, done(err_3, false)];
            case 3: return [2 /*return*/];
        }
    });
}); }));
// Remove serializeUser and deserializeUser since sessions are not used
