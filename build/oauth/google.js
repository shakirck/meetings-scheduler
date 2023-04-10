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
Object.defineProperty(exports, "__esModule", { value: true });
const { google } = require("googleapis");
class Auth {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(process.env.CLIENTID, process.env.ClIENT_SECRET, process.env.REDIRECT_URI || "");
        this.oauth2Client.on("tokens", (tokens) => {
            if (tokens.refresh_token) {
                console.log(tokens.refresh_token);
            }
            console.log(tokens.access_token);
        });
    }
    getAuthUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const scopes = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];
            const url = this.oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: scopes,
            });
            return url;
        });
    }
    getAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokens } = yield this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            const oauth2 = google.oauth2({
                auth: this.oauth2Client,
                version: "v2",
            });
            const { data } = yield oauth2.userinfo.get();
            const email = data.email;
            const name = data.name;
            return {
                tokens,
                email,
                name,
            };
        });
    }
    getClient() {
        return this.oauth2Client;
    }
}
exports.default = Auth;
