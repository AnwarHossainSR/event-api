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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const helper_1 = require("../../../utils/helper");
const user_controller_1 = __importDefault(require("../../user/user.controller"));
const event_controller_1 = __importDefault(require("../event.controller"));
const event_service_1 = __importDefault(require("../event.service"));
const eventServiceMock = new event_service_1.default();
const app = new app_1.default([new event_controller_1.default(), new user_controller_1.default()], Number(5000));
let authToken = '';
let newlyCreatedEventId = '';
describe('EventController', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Log in to get a token
        const authResponse = yield (0, supertest_1.default)(app.express)
            .post('/api/users/login')
            .send({
            email: 'admin@admin.com',
            password: '123456',
        });
        authToken = authResponse.body.token;
    }));
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /api/events', () => {
        it('should return a list of events', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockEvents = [
                {
                    id: 'cm333lpme0003107gs9fbknu0',
                    name: 'Anwar Hossain',
                    startDate: '2024-11-07T14:09:00.000Z',
                    endDate: '2024-11-15T14:09:00.000Z',
                    totalSeats: 4345,
                    availableSeats: 3336,
                    venue: 'dgdfgdfg',
                    createdBy: 'cm32vm4e0000111zeai8xoru6',
                    createdAt: '2024-11-04T14:10:07.478Z',
                    updatedAt: '2024-11-04T15:14:53.541Z',
                },
                {
                    id: 'cm333bvcm0001107gzguzxhl8',
                    name: 'sdfdsf',
                    startDate: '2024-11-21T13:59:00.000Z',
                    endDate: '2024-11-28T13:59:00.000Z',
                    totalSeats: 345,
                    availableSeats: 119,
                    venue: 'asdfsdgdsggd',
                    createdBy: 'cm32vm4e0000111zeai8xoru6',
                    createdAt: '2024-11-04T14:02:28.340Z',
                    updatedAt: '2024-11-04T15:57:37.665Z',
                },
                {
                    id: 'cm333oto60005107go3db52gj',
                    name: 'gfdgdfg',
                    startDate: '2024-11-20T08:12:00.000Z',
                    endDate: '2024-11-22T08:12:00.000Z',
                    totalSeats: 345,
                    availableSeats: 38,
                    venue: 'updated',
                    createdBy: 'cm32vm4e0000111zeai8xoru6',
                    createdAt: '2024-11-04T14:12:32.694Z',
                    updatedAt: '2024-11-04T17:32:05.489Z',
                },
            ];
            jest.spyOn(eventServiceMock, 'getEvents').mockResolvedValueOnce(mockEvents);
            const response = yield (0, supertest_1.default)(app.express).get('/api/events');
            expect(response.status).toBe(200);
        }));
        it('should return a 404 error if the API route does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.express).get('/api/nonexistent-route');
            expect(response.status).toBe(404);
        }));
    });
    describe('POST /api/events', () => {
        it('Should create a new event', () => __awaiter(void 0, void 0, void 0, function* () {
            const newEvent = (0, helper_1.generateUniqueEvent)();
            jest.spyOn(eventServiceMock, 'createEvent').mockResolvedValueOnce(newEvent);
            const response = yield (0, supertest_1.default)(app.express)
                .post('/api/events')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newEvent);
            newEvent.createdAt = response.body.data.createdAt;
            newEvent.updatedAt = response.body.data.updatedAt;
            newEvent.id = newlyCreatedEventId = response.body.data.id;
            newEvent.createdBy = response.body.data.createdBy;
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: 'Event created successfully',
                data: newEvent,
            });
        }));
        it('should return a validation error if the request body is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidEvent = {
                name: '',
                startDate: 'invalid-date',
            };
            const response = yield (0, supertest_1.default)(app.express)
                .post('/api/events')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidEvent);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'Validation Error',
                errors: {
                    name: 'name is not allowed to be empty',
                    startDate: 'startDate must be in ISO 8601 date format',
                    endDate: 'endDate is required',
                    venue: 'venue is required',
                    totalSeats: 'totalSeats is required',
                    availableSeats: 'availableSeats is required',
                },
            });
        }));
    });
    describe('PUT /api/events/:id', () => {
        it('should update an existing event', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedEvent = {
                name: 'Updated Event',
                totalSeats: 250,
                availableSeats: 220,
            };
            jest.spyOn(eventServiceMock, 'updateEvent').mockResolvedValueOnce(updatedEvent);
            const response = yield (0, supertest_1.default)(app.express)
                .put(`/api/events/${newlyCreatedEventId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedEvent);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                message: 'Event updated successfully',
            }));
        }));
        it('should return a 404 error if the event is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(eventServiceMock, 'updateEvent').mockRejectedValueOnce(new Error('Event not found'));
            const response = yield (0, supertest_1.default)(app.express)
                .put('/api/events/999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Nonexistent Event' });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'Event not found',
                status: 400,
            });
        }));
    });
    describe('DELETE /api/events/:id', () => {
        it('should delete an event successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            if (newlyCreatedEventId) {
                jest.spyOn(eventServiceMock, 'deleteEvent').mockResolvedValueOnce(undefined);
                const response = yield (0, supertest_1.default)(app.express)
                    .delete(`/api/events/${newlyCreatedEventId}`)
                    .set('Authorization', `Bearer ${authToken}`);
                expect(response.status).toBe(204);
                expect(response.body).toEqual({});
            }
        }));
        it('should return a 404 error if the event is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(eventServiceMock, 'deleteEvent').mockRejectedValueOnce(new Error('Event not found'));
            const response = yield (0, supertest_1.default)(app.express)
                .delete('/api/events/999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                message: 'Event not found',
                status: 404,
            });
        }));
    });
});
//# sourceMappingURL=event.controller.test.js.map