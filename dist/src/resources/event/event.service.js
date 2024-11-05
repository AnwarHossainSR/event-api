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
const client_1 = require("@prisma/client");
class EventService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = data.startDate;
                const endDate = data.endDate;
                const overlapEvent = yield this.prisma.event.findFirst({
                    where: {
                        venue: data.venue,
                        AND: [
                            {
                                startDate: { lte: endDate },
                            },
                            {
                                endDate: { gte: startDate },
                            },
                        ],
                    },
                });
                if (overlapEvent) {
                    throw new Error('An event is already scheduled at this time and venue.');
                }
                return yield this.prisma.event.create({ data });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updateEvent(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield this.prisma.event.findUnique({ where: { id } });
                if (!event)
                    throw new Error('Event not found');
                const venue = data.venue || event.venue;
                const startDate = data.startDate || event.startDate;
                const endDate = data.endDate || event.endDate;
                const whereConditions = {
                    id: { not: id },
                    venue: venue,
                    AND: [
                        {
                            startDate: { lte: endDate },
                        },
                        {
                            endDate: { gte: startDate },
                        },
                    ],
                };
                // Check for overlapping events if venue, startDate, or endDate are provided
                const overlapEvent = yield this.prisma.event.findFirst({
                    where: whereConditions,
                });
                if (overlapEvent) {
                    throw new Error('Another event is already scheduled at this time and venue.');
                }
                // Prepare the update data
                const updateData = Object.assign(Object.assign({}, data), { // Include any other fields from data
                    venue,
                    startDate,
                    endDate });
                // Perform the update
                return yield this.prisma.event.update({
                    where: { id },
                    data: updateData,
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield this.prisma.event.findUnique({ where: { id } });
                if (!event)
                    throw new Error('Event not found');
                yield this.prisma.event.delete({ where: { id } });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.event.findMany();
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield this.prisma.event.findUnique({ where: { id } });
                if (!event)
                    throw new Error('Event not found');
                return event;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = EventService;
//# sourceMappingURL=event.service.js.map