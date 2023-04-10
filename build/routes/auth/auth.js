"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_1 = __importDefault(require("../../oauth/google"));
const authrouter = (0, express_1.Router)();
const user_1 = __importDefault(require("../../models/user"));
/**
 * @openapi
 * /auth/login:
 *  get:
 *     tags:
 *     - AUTH
 *     description: Login with google oauth
 *     responses:
 *       200:
 *         description: Google login success
 */
authrouter.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new google_1.default();
    const scopes = ["https://www.googleapis.com/auth/calendar"];
    const url = yield auth.getAuthUrl();
    res.redirect(url);
}));
/**
 * @openapi
 * /auth/gmail/callback:
 *  get:
 *    tags:
 *    - AUTH
 *    description: callback url for google oauth , it also fetches tokens and user info from google
 *    responses:
 *      200:
 *        description:  oauth success
 */
authrouter.get("/gmail/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        if (!code) {
            res.send("error");
        }
        const auth = new google_1.default();
        const data = yield auth.getAccessToken(code);
        const user = yield user_1.default.findOne({ email: data.email });
        if (user) {
            user.token = data.tokens;
            yield user.save();
        }
        else {
            yield user_1.default.create({
                email: data.email,
                name: data.name,
                token: data.tokens,
            });
        }
        res.status(200).json({
            message: "success",
            data: data,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "error",
            error: error,
        });
    }
}));
exports.default = authrouter;
