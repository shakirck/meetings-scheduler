"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const schedules_routes_1 = __importDefault(require("../routes/schedule/schedules.routes"));
app_1.default.use('/schedule', schedules_routes_1.default);
