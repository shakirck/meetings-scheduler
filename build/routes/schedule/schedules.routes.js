"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schedule_controller_1 = require("../../controllers/schedule.controller");
const scheduleRouter = (0, express_1.Router)();
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateMeeting:
 *      type: object
 *      required:
 *        - summary
 *        - description
 *        - attendee
 *        - startDateTime
 *        - endDateTime
 *        - email
 *      properties:
 *        summary:
 *          type: string
 *          default: Introduction Call with John Doe
 *        description:
 *          type: string
 *          default: Lets discuss the future plans and hopefully we can make a good deal
 *        attendee:
 *          type: string
 *          default: useremail@gmail.com
 *        startDateTime:
 *          type: string
 *          default: 2023-04-11T17:00:00+05:30
 *        endDateTime:
 *          type: string
 *          default: 2023-04-11T23:30:00+05:30
 *        email:
 *          type: string
 *          default: useremail@gmail.com
 *          description: this is the host email
 *    FetchMeetings:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        summary:
 *        email:
 *          type: string
 *          default: useremail@gmail.com
 *          description: this is the host email
 *
 */
/**
 * @openapi
 * /schedule:
 *  post:
 *    tags:
 *    - Schedule
 *    description: schedules a meeting with a host
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateMeeting'
 *    responses:
 *      200:
 *        description: meeting created successfully
 *
 *
 */
scheduleRouter.post("/", schedule_controller_1.schedule);
/**
 * @openapi
 * /schedule/availability:
 *  post:
 *    tags:
 *    - Schedule
 *    description: Fetches the availability of a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/FetchMeetings'
 *    parameters:
 *      - in: query
 *        name: date
 *        type: string
 *        required: true
 *        description: date in dd-mm-yyyy format , this is the date for which we want to fetch the availability
 *    responses:
 *      200:
 *        description: availability fetched successfully
 *
 */
scheduleRouter.post("/availability/", schedule_controller_1.availability);
/**
 * @openapi
 * /schedule/meetings:
 *  post:
 *    tags:
 *    - Schedule
 *    description: Fetches the Meetings of a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/FetchMeetings'
 *    parameters:
 *      - in: query
 *        name: date
 *        type: string
 *        required: true
 *        description: date in dd-mm-yyyy format , this is the date for which we want to fetch the availability
 *    responses:
 *      200:
 *        description: meetings fetched successfully
 *
 */
scheduleRouter.post("/meetings/", schedule_controller_1.meetings);
exports.default = scheduleRouter;
