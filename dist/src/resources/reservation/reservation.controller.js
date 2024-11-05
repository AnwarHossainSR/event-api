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
const reservation_service_1 = __importDefault(require("../../resources/reservation/reservation.service"));
const reservation_validation_1 = __importDefault(require("../../resources/reservation/reservation.validation"));
const http_exception_1 = __importDefault(require("../../utils/exceptions/http.exception"));
class ReservationController {
    constructor() {
        this.path = '/reservations';
        this.router = (0, express_1.Router)();
        this.reservationService = new reservation_service_1.default();
        /**
         * @swagger
         * /api/reservations/create:
         *   post:
         *     tags:
         *       - "Reservation"
         *     summary: "Create a new reservation"
         *     description: "Creates a reservation with user ID, event ID, seats, start and end dates."
         *     operationId: "createReservation"
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               userId:
         *                 type: string
         *                 example: "cm31rajqh0000a4sld5dagd96"
         *               eventId:
         *                 type: string
         *                 example: "cm32hl3270003qel6tai7ig1r"
         *               seats:
         *                 type: integer
         *                 example: 3
         *               startDate:
         *                 type: string
         *                 format: date
         *                 example: "2024-11-01"
         *               endDate:
         *                 type: string
         *                 format: date
         *                 example: "2024-11-02"
         *     responses:
         *       '201':
         *         description: Reservation created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Reservation created successfully"
         *                 data:
         *                   type: object
         *                   additionalProperties: true
         *       '400':
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Invalid request data"
         *
         */
        this.createReservation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, eventId, seats, startDate, endDate } = req.body;
                const reservation = yield this.reservationService.createReservation(userId, eventId, seats, startDate, endDate);
                res.status(201).json({
                    message: 'Reservation created successfully',
                    data: reservation,
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        /**
         * @swagger
         * /api/reservations/{id}:
         *   get:
         *     tags:
         *       - "Reservation"
         *     summary: "Get a reservation by ID"
         *     description: "Retrieves reservation details by reservation ID."
         *     operationId: "getReservation"
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the reservation to retrieve
         *     responses:
         *       '200':
         *         description: Reservation retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Reservation retrieved successfully"
         *                 data:
         *                   type: object
         *                   additionalProperties: true
         *       '404':
         *         description: Reservation not found
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Reservation not found"
         *
         */
        this.getReservation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const reservation = yield this.reservationService.getReservation(id);
                if (!reservation)
                    throw new http_exception_1.default(404, 'Reservation not found');
                res.status(200).json({
                    message: 'Reservation retrieved successfully',
                    data: reservation,
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        /**
         * @swagger
         * /api/reservations:
         *   get:
         *     tags:
         *       - "Reservation"
         *     summary: "Retrieve all reservations"
         *     description: "Retrieves a list of all reservations."
         *     operationId: "getReservations"
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       '200':
         *         description: Reservations retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Reservations retrieved successfully"
         *                 data:
         *                   type: array
         *                   items:
         *                     type: object
         *                     additionalProperties: true
         *       '400':
         *         description: Bad request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Bad request"
         */
        this.getReservations = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const reservations = yield this.reservationService.getReservations();
                res.status(200).json({
                    message: 'Reservations retrieved successfully',
                    data: reservations,
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.deleteReservation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.reservationService.deleteReservation(id);
                res.status(200).json({
                    message: 'Reservation deleted successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/create`, authenticated_middleware_1.default, (0, validation_middleware_1.default)(reservation_validation_1.default.create), this.createReservation);
        this.router.get(`${this.path}/:id`, authenticated_middleware_1.default, this.getReservation);
        this.router.get(`${this.path}`, authenticated_middleware_1.default, admin_middleware_1.default, this.getReservations);
        this.router.delete(`${this.path}/:id`, authenticated_middleware_1.default, admin_middleware_1.default, this.deleteReservation);
    }
}
exports.default = ReservationController;
//# sourceMappingURL=reservation.controller.js.map