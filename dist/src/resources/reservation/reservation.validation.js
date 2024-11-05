"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const create = joi_1.default.object({
    userId: joi_1.default.string().required(),
    eventId: joi_1.default.string().required(),
    seats: joi_1.default.number().integer().positive().required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
});
exports.default = { create };
//# sourceMappingURL=reservation.validation.js.map