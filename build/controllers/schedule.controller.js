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
exports.meetings = exports.schedule = exports.availability = void 0;
const google_1 = __importDefault(require("../oauth/google"));
const googleapis_1 = require("googleapis");
const user_1 = __importDefault(require("../models/user"));
const dayjs_1 = __importDefault(require("../config/dayjs"));
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const emailSchema = zod_1.z.string().email();
const availability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        try {
            yield mongoose_1.default.connect(process.env.MONGODB_URI || "");
        }
        catch (error) {
            console.log("Error connecting to mongo", error);
            console.log(process.env.MONGODB_URI);
        }
        const auth = new google_1.default();
        const client = auth.getClient();
        const email = emailSchema.safeParse(req.body.email);
        if (!email.success) {
            return res.status(400).json({ error: email.error });
        }
        const user = yield user_1.default.findOne({ email: email.data });
        if (!user) {
            return res.send("User not found");
        }
        client.setCredentials(user.token);
        const { date } = req.query;
        const newDate = (0, dayjs_1.default)(date).format("DD/MM/YYYY");
        const startOfDay = (0, dayjs_1.default)(newDate).startOf("day").format();
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: client });
        const endOfDay = (0, dayjs_1.default)(newDate).endOf("day").format();
        const requestBody = {
            requestBody: {
                timeMin: startOfDay,
                timeMax: endOfDay,
                timeZone: "UTC",
                items: [{ id: "primary" }],
            },
        };
        const { data } = yield calendar.freebusy.query(requestBody);
        if (!((_b = (_a = data === null || data === void 0 ? void 0 : data.calendars) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.busy)) {
            return res.json({ availableSlots: [] });
        }
        const busySlots = data.calendars.primary.busy;
        const availableSlots = [];
        let start = (0, dayjs_1.default)(startOfDay);
        let busyslotindex = 0;
        while (start.isBefore(endOfDay)) {
            const busySlot = busySlots[busyslotindex];
            let isSlotAvailable = true;
            if (busyslotindex < busySlots.length &&
                start.isBetween(busySlot.start, busySlot.end)) {
                start = (0, dayjs_1.default)(busySlot.end);
                busyslotindex++;
                isSlotAvailable = false;
            }
            availableSlots.push({
                start: start.format(),
                end: start.add(30, "minute").format(),
                available: isSlotAvailable,
            });
            start = (0, dayjs_1.default)(start.add(30, "minute").format());
        }
        console.log({
            busySlots,
            startOfDay,
            endOfDay,
        });
        return res.json({ availableSlots });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving availability" });
    }
});
exports.availability = availability;
const schedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        try {
            yield mongoose_1.default.connect(process.env.MONGODB_URI || "");
        }
        catch (error) {
            console.log("Error connecting to mongo", error);
            console.log(process.env.MONGODB_URI);
        }
        const auth = new google_1.default();
        const client = auth.getClient();
        const email = emailSchema.safeParse(req.body.email);
        if (!email.success) {
            return res.status(400).json({ error: email.error });
        }
        const user = yield user_1.default.findOne({ email: email.data });
        if (!user) {
            return res.send("user not found");
        }
        client.setCredentials(user.token);
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: client });
        const { summary, description, attendee, startDateTime, endDateTime } = req.body;
        const attendees = [attendee];
        const event = {
            summary: summary,
            description: description,
            start: {
                dateTime: startDateTime,
                timeZone: "UTC",
            },
            end: {
                dateTime: endDateTime,
                timeZone: "UTC",
            },
            attendees: attendees.map((email) => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: "sample123",
                },
            },
        };
        const result = yield calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
            auth: client,
        });
        return res.status(200).send(result.data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error scheduling meeting" });
    }
});
exports.schedule = schedule;
const meetings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        try {
            yield mongoose_1.default.connect(process.env.MONGODB_URI || "");
        }
        catch (error) {
            console.log("Error connecting to mongo", error);
            console.log(process.env.MONGODB_URI);
        }
        const auth = new google_1.default();
        const client = auth.getClient();
        const email = emailSchema.safeParse(req.body.email);
        if (!email.success) {
            return res.status(400).json({ error: email.error });
        }
        const user = yield user_1.default.findOne({ email: email.data });
        if (!user) {
            return res.send("User not found");
        }
        client.setCredentials(user.token);
        const { date } = req.query;
        const newDate = (0, dayjs_1.default)(date).format("DD/MM/YYYY");
        const startOfDay = (0, dayjs_1.default)(newDate).startOf("day").format();
        console.log({
            newDate, startOfDay
        });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: client });
        const endOfDay = (0, dayjs_1.default)(newDate).endOf("day").format();
        const { data } = yield calendar.freebusy.query({
            requestBody: {
                timeMin: startOfDay,
                timeMax: endOfDay,
                timeZone: "UTC",
                items: [{ id: "primary" }],
            },
        });
        if (!((_d = (_c = data === null || data === void 0 ? void 0 : data.calendars) === null || _c === void 0 ? void 0 : _c.primary) === null || _d === void 0 ? void 0 : _d.busy)) {
            return res.json({ availableSlots: [] });
        }
        const busySlots = data.calendars.primary.busy;
        const availableSlots = [];
        console.log({
            busySlots,
            startOfDay,
            endOfDay,
        });
        res.json({ busySlots });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving availability");
    }
});
exports.meetings = meetings;
