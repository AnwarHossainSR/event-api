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
const client_1 = require("@prisma/client");
const http_exception_1 = __importDefault(require("../../utils/exceptions/http.exception"));
class ReservationService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createReservation(userId, eventId, seats, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    const event = yield transaction.event.findUnique({
                        where: { id: eventId },
                        select: {
                            availableSeats: true,
                            startDate: true,
                            endDate: true,
                        },
                    });
                    if (!event) {
                        throw new http_exception_1.default(404, 'Invalid event ID');
                    }
                    // Check if the requested seats are available
                    if (event.availableSeats < seats) {
                        throw new http_exception_1.default(400, 'Not enough available seats');
                    }
                    // Check if reservation dates are within the event's dates
                    if (startDate < event.startDate || endDate > event.endDate) {
                        throw new http_exception_1.default(400, 'Reservation dates must be within the event duration');
                    }
                    // Check for overlapping reservations for the same user
                    const existingReservation = yield transaction.reservation.findFirst({
                        where: {
                            userId: userId,
                            eventId: eventId,
                            // Check if there is any overlap in dates
                            OR: [
                                {
                                    startDate: { lte: endDate },
                                    endDate: { gte: startDate },
                                },
                            ],
                        },
                    });
                    if (existingReservation) {
                        throw new http_exception_1.default(400, 'User already has a reservation for this event on the same date');
                    }
                    // Update the available seats in a transaction
                    const updatedEvent = yield transaction.event.update({
                        where: { id: eventId },
                        data: {
                            availableSeats: {
                                decrement: seats,
                            },
                        },
                        select: { availableSeats: true },
                    });
                    // Check again after decrementing to ensure there are enough seats
                    if (updatedEvent.availableSeats < 0) {
                        throw new http_exception_1.default(400, 'Not enough available seats');
                    }
                    // Create the reservation
                    const reservation = yield transaction.reservation.create({
                        data: {
                            startDate,
                            endDate,
                            seats,
                            user: { connect: { id: userId } },
                            event: { connect: { id: eventId } },
                        },
                    });
                    const user = yield transaction.user.findUnique({
                        where: { id: userId },
                        select: { email: true, name: true },
                    });
                    if (user) {
                        yield transaction.emailQueue.create({
                            data: {
                                to: user.email,
                                subject: 'Your Reservation Confirmation',
                                body: `Greeting ${user.name}!, \n\nYour reservation for ${eventId} has been confirmed. please find the details below:\n\nEvent Date: ${startDate}\nNumber of Seats: ${seats}\n\nThank you for using our service!`,
                            },
                        });
                    }
                    return reservation;
                }));
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getReservation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.reservation.findUnique({
                    where: { id },
                    include: { user: true, event: true },
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.reservation.findMany({
                    include: { user: true, event: true },
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteReservation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.reservation.delete({ where: { id } });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = ReservationService;
//# sourceMappingURL=reservation.service.js.map