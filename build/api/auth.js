"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const auth_1 = __importDefault(require("../routes/auth/auth"));
app_1.default.use('/auth', auth_1.default);
exports.default = auth_1.default;
