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
const admin_middleware_1 = __importDefault(require("../../middleware/admin.middleware"));
const authenticated_middleware_1 = __importDefault(require("../../middleware/authenticated.middleware"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const http_exception_1 = __importDefault(require("../../utils/exceptions/http.exception"));
const event_service_1 = __importDefault(require("./event.service"));
const event_validation_1 = __importDefault(require("./event.validation"));
class EventController {
    constructor() {
        this.path = '/events';
        this.router = (0, express_1.Router)();
        this.eventService = new event_service_1.default();
        /**
         * @swagger
         * /api/events:
         *   get:
         *     tags:
         *       - "Event"
         *     description: "Get all events"
         *     operationId: "getEvents"
         *     responses:
         *       '200':
         *         description: A list of events retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 additionalProperties: true
         *       '400':
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   description: Message = Invalid request
         *
         */
        this.getEvents = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield this.eventService.getEvents();
                res.status(200).json({
                    message: 'Events retrieved successfully',
                    data: events,
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        /**
         * @swagger
         * /api/events:
         *   post:
         *     tags:
         *       - "Event"
         *     description: "Create a new event"
         *     operationId: "createEvent"
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: "Sample Event"
         *               startDate:
         *                 type: string
         *                 format: date-time
         *                 example: "2024-11-03T10:00:00Z"
         *               endDate:
         *                 type: string
         *                 format: date-time
         *                 example: "2024-11-03T12:00:00Z"
         *               venue:
         *                 type: string
         *                 example: "Sample Venue"
         *               totalSeats:
         *                 type: integer
         *                 example: 100
         *               availableSeats:
         *                 type: integer
         *                 example: 100
         *
         *     responses:
         *       '201':
         *         description: Event created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               additionalProperties: true
         *       '400':
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   description: Message = Invalid request
         */
        this.createEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const { error, value } = event_validation_1.default.createEvent.validate(req.body);
                if (error) {
                    return next(new http_exception_1.default(400, error.details[0].message));
                }
                value.createdBy = req.user.id;
                const event = yield this.eventService.createEvent(value);
                res.status(201).json({
                    message: 'Event created successfully',
                    data: event,
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        /**
         * @swagger
         * /api/events/{id}:
         *   put:
         *     tags:
         *       - "Event"
         *     description: "Update an event"
         *     operationId: "updateEvent"
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: The ID of the event to update
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: "Updated Sample Event"
         *               startDate:
         *                 type: string
         *                 format: date-time
         *                 example: "2024-11-03T10:00:00Z"
         *               endDate:
         *                 type: string
         *                 format: date-time
         *                 example: "2024-11-03T12:00:00Z"
         *               venue:
         *                 type: string
         *                 example: "Updated Sample Venue"
         *               totalSeats:
         *                 type: integer
         *                 example: 120
         *               availableSeats:
         *                 type: integer
         *                 example: 80
         *     responses:
         *       '200':
         *         description: Event updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               additionalProperties: true
         *       '400':
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   description: Message = Invalid request
         *       '404':
         *         description: Event not found
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   description: Message = Event not found
         *
         */
        this.updateEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                const event = yield this.eventService.updateEvent(eventId, req.body);
                res.status(200).json({
                    message: 'Event updated successfully',
                    data: event,
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        /**
         * @swagger
         * /api/events/{id}:
         *   delete:
         *     tags:
         *       - "Event"
         *     description: "Delete an event"
         *     operationId: "deleteEvent"
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: The ID of the event to delete
         *         schema:
         *           type: string
         *     responses:
         *       '204':
         *         description: Event deleted successfully
         *       '404':
         *         description: Event not found
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   description: Message = Event not found
         *
         */
        this.deleteEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                yield this.eventService.deleteEvent(eventId);
                res.status(204).send({
                    message: 'Event deleted successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(404, error.message));
            }
        });
        /**
         * @swagger
         * /api/events/{id}:
         *   get:
         *     tags:
         *       - "Event"
         *     description: "Get an event by ID"
         *     operationId: "getEventById"
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: The ID of the event to retrieve
         *         schema:
         *           type: string
         *     responses:
         *       '200':
         *         description: Event fetched successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   description: "Event fetched successfully!"
         *                 data:
         *                   type: object
         *                   description: "Event data"
         *                   properties:
         *                     id:
         *                       type: string
         *                       description: "ID of the event"
         *                     name:
         *                       type: string
         *                       description: "Name of the event"
         *                     description:
         *                       type: string
         *                       description: "Description of the event"
         *                     date:
         *                       type: string
         *                       format: date-time
         *                       description: "Date and time of the event"
         *                     location:
         *                       type: string
         *                       description: "Location of the event"
         *       '400':
         *         description: Bad request or error fetching the event
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   description: "Error message describing the problem"
         */
        this.getEventById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                const event = yield this.eventService.getEvent(eventId);
                res.status(200).json({
                    message: 'Event fetched successfully!',
                    data: event,
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, authenticated_middleware_1.default, admin_middleware_1.default, (0, validation_middleware_1.default)(event_validation_1.default.createEvent), this.createEvent);
        this.router.put(`${this.path}/:id`, authenticated_middleware_1.default, admin_middleware_1.default, (0, validation_middleware_1.default)(event_validation_1.default.updateEvent), this.updateEvent);
        this.router.delete(`${this.path}/:id`, authenticated_middleware_1.default, admin_middleware_1.default, this.deleteEvent);
        this.router.get(`${this.path}`, this.getEvents);
        this.router.get(`${this.path}/:id`, this.getEventById);
    }
}
exports.default = EventController;
//# sourceMappingURL=event.controller.js.map