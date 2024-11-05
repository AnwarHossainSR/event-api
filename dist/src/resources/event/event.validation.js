"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createEvent = joi_1.default.object({
    name: joi_1.default.string().max(50).required(),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().greater(joi_1.default.ref('startDate')).required(),
    venue: joi_1.default.string().max(100).required(),
    totalSeats: joi_1.default.number().integer().greater(0).required(),
    availableSeats: joi_1.default.number().integer().greater(-1).required(),
});
const updateEvent = joi_1.default.object({
    name: joi_1.default.string().max(50),
    startDate: joi_1.default.date(),
    endDate: joi_1.default.date(),
    venue: joi_1.default.string().max(100),
    totalSeats: joi_1.default.number().integer().greater(0),
    availableSeats: joi_1.default.number().integer().greater(-1),
}).or('name', 'startDate', 'endDate', 'venue', 'totalSeats', 'availableSeats');
exports.default = { createEvent, updateEvent };
//# sourceMappingURL=event.validation.js.map