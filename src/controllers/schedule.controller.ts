import { Request, Response } from "express";
import Auth from "../oauth/google";
import { google } from "googleapis";
import User from "../models/user";
import dayjs from '../config/dayjs'
import { z } from "zod";
import mongoose from "mongoose";
const emailSchema = z.string().email();
export const availability = async (req: Request, res: Response) => {
  try {

    try {
      await mongoose.connect(process.env.MONGODB_URI|| "")

  } catch (error) {   
      console.log("Error connecting to mongo",error);
      console.log(process.env.MONGODB_URI)
      
  }
    const auth = new Auth();
    const client = auth.getClient();
    const email = emailSchema.safeParse(req.body.email)
    if(!email.success) {
      return res.status(400).json({error: email.error})
    }
    const user = await User.findOne({ email: email.data });
    if (!user) {
      return res.send("User not found");
    }
    client.setCredentials(user.token);
    const {date } = req.query
    const newDate = dayjs(date as string).format("DD/MM/YYYY");
    const startOfDay = dayjs(newDate).startOf("day").format();
    const calendar = google.calendar({ version: "v3", auth: client });
    const endOfDay = dayjs(newDate).endOf("day").format();

    const requestBody = {
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        timeZone: "UTC",
        items: [{ id: "primary" }],
      },
    }
    const { data } = await calendar.freebusy.query(requestBody);
    if (!data?.calendars?.primary?.busy) {
      return res.json({ availableSlots: [] });
    }

    const busySlots = data.calendars.primary.busy;
    const availableSlots: any = [];
    let start = dayjs(startOfDay);
    let busyslotindex = 0;
    while (start.isBefore(endOfDay)) {
      const busySlot = busySlots[busyslotindex];
      let isSlotAvailable = true;
      if (
        busyslotindex < busySlots.length &&
        start.isBetween(busySlot.start, busySlot.end)
      ) {
        start = dayjs(busySlot.end);
        busyslotindex++;
        isSlotAvailable = false;
      }
      availableSlots.push({
        start: start.format(),
        end: start.add(30, "minute").format(),
        available: isSlotAvailable,
      });

      start = dayjs(start.add(30, "minute").format());
    }

    console.log({
      busySlots,
      startOfDay,
      endOfDay,
    });

    return res.json({ availableSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving availability" });
  }
};

export const schedule = async (req: Request, res: Response) => {
  try {

    try {
      await mongoose.connect(process.env.MONGODB_URI|| "")

  } catch (error) {   
      console.log("Error connecting to mongo",error);
      console.log(process.env.MONGODB_URI)
      
  }
    const auth = new Auth();
    const client = auth.getClient();
    const email = emailSchema.safeParse(req.body.email);
    if(!email.success) {
      return res.status(400).json({error: email.error})
    }
    const user = await User.findOne({ email: email.data });
    if (!user) {
      return res.send("user not found");
    }
    client.setCredentials(user.token);

    const calendar = google.calendar({ version: "v3", auth: client });

    const { summary, description, attendee, startDateTime, endDateTime } =
      req.body;
    const attendees = [attendee]
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
      attendees: attendees.map((email: any) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: "sample123",
        },
      },
    };

    const result = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      auth: client,
    });
    return res.status(200).send(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error scheduling meeting" });
  }
};

export const meetings = async (req: Request, res: Response) => {
  try {

    try {
      await mongoose.connect(process.env.MONGODB_URI|| "")

  } catch (error) {   
      console.log("Error connecting to mongo",error);
      console.log(process.env.MONGODB_URI)
      
  }
    const auth = new Auth();
    const client = auth.getClient();
    const email = emailSchema.safeParse(req.body.email);
    if(!email.success) {
      return res.status(400).json({error: email.error})
    }
    const user = await User.findOne({ email:  email.data });
    if (!user) {
      return res.send("User not found");
    }
    client.setCredentials(user.token);
    const {date } = req.query
    
    const newDate = dayjs(date as string).format("DD/MM/YYYY");
    const startOfDay = dayjs(newDate).startOf("day").format();
    console.log({
      newDate,startOfDay
    })
    const calendar = google.calendar({ version: "v3", auth: client });
    const endOfDay = dayjs(newDate).endOf("day").format();
 
    const { data } = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        timeZone: "UTC",
        items: [{ id: "primary" }],
      },
    });
    if (!data?.calendars?.primary?.busy) {
      return res.json({ availableSlots: [] });
    }

    const busySlots = data.calendars.primary.busy;

    const availableSlots: any = [];

    console.log({
      busySlots,
      startOfDay,
      endOfDay,
    });

    res.json({ busySlots });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving availability");
  }
};
