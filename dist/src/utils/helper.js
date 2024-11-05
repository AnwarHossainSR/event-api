"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueEvent = void 0;
const generateUniqueEvent = () => {
    const timestamp = Date.now();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 7) + 1);
    return {
        name: `New Event ${timestamp}`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        venue: `Venue ${Math.floor(Math.random() * 1000)}`,
        totalSeats: 100,
        availableSeats: 100,
    };
};
exports.generateUniqueEvent = generateUniqueEvent;
//# sourceMappingURL=helper.js.map