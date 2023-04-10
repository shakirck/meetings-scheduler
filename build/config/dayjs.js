"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
dayjs_1.default.extend(isBetween_1.default);
dayjs_1.default.extend(timezone);
dayjs_1.default.extend(utc);
exports.default = dayjs_1.default;
