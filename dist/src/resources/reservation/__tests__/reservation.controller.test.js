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
const event_controller_1 = __importDefault(require("../../event/event.controller"));
const user_controller_1 = __importDefault(require("../../user/user.controller"));
const reservation_controller_1 = __importDefault(require("../reservation.controller"));
const reservation_service_1 = __importDefault(require("../reservation.service"));
const reservationServiceMock = new reservation_service_1.default();
const app = new app_1.default([new reservation_controller_1.default(), new user_controller_1.default(), new event_controller_1.default()], Number(5000));
let authToken = '';
let newlyCreatedReservation = '';
let user = null;
describe('ReservationController', () => {
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
    describe('POST /api/reservations/create', () => {
        it('should create a new reservation', () => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, supertest_1.default)(app.express)
                .get('/api/me')
                .set('Authorization', `Bearer ${authToken}`);
            const events = yield (0, supertest_1.default)(app.express).get('/api/events');
            if (events.body.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * events.body.data.length);
                const singleEvent = events.body.data[randomIndex];
                const newReservation = {
                    id: 'reservation123',
                    userId: user.body.data.id,
                    eventId: singleEvent.id,
                    seats: 3,
                    startDate: singleEvent.startDate,
                    endDate: singleEvent.endDate,
                    createdAt: new Date(),
                };
                jest.spyOn(reservationServiceMock, 'createReservation').mockResolvedValueOnce(newReservation);
                const response = yield (0, supertest_1.default)(app.express)
                    .post('/api/reservations/create')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                    userId: newReservation.userId,
                    eventId: newReservation.eventId,
                    seats: newReservation.seats,
                    startDate: newReservation.startDate,
                    endDate: newReservation.endDate,
                });
                newlyCreatedReservation = response.body.data.id;
                expect(response.status).toBe(201);
                expect(response.body).toEqual(expect.objectContaining({
                    message: 'Reservation created successfully',
                    data: expect.objectContaining({
                        userId: newReservation.userId,
                        eventId: newReservation.eventId,
                        seats: newReservation.seats,
                        startDate: newReservation.startDate,
                        endDate: newReservation.endDate,
                    }),
                }));
            }
        }));
        it('should return insufficient available seats error', () => __awaiter(void 0, void 0, void 0, function* () {
            const events = yield (0, supertest_1.default)(app.express).get('/api/events');
            if (events.body.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * events.body.data.length);
                const singleEvent = events.body.data[randomIndex];
                const response = yield (0, supertest_1.default)(app.express)
                    .post('/api/reservations/create')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                    userId: user.body.data.id,
                    eventId: singleEvent.id,
                    seats: 1000000,
                    startDate: '2024-11-02',
                    endDate: '2024-11-02',
                });
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expect.objectContaining({
                    message: 'Not enough available seats',
                }));
            }
        }));
        it('should return a validation error if the request body is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidReservation = {
                userId: '',
                eventId: 'cm32hl3270003qel6tai7ig1r',
                seats: -1,
                startDate: 'invalid-date',
                endDate: '2024-11-02',
            };
            const response = yield (0, supertest_1.default)(app.express)
                .post('/api/reservations/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidReservation);
            expect(response.status).toBe(400);
            expect(response.body).toEqual(expect.objectContaining({
                message: 'Validation Error',
            }));
        }));
    });
    describe('GET /api/reservations/:id', () => {
        it('should retrieve a reservation by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            if (newlyCreatedReservation) {
                const response = yield (0, supertest_1.default)(app.express)
                    .get(`/api/reservations/${newlyCreatedReservation}`)
                    .set('Authorization', `Bearer ${authToken}`);
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expect.objectContaining({
                    message: 'Reservation retrieved successfully',
                }));
            }
        }));
        it('should return a 404 error if the reservation is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(reservationServiceMock, 'getReservation').mockRejectedValueOnce(new Error('Reservation not found'));
            const response = yield (0, supertest_1.default)(app.express)
                .get('/api/reservations/999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'Reservation not found',
                status: 400,
            });
        }));
        it('should delete an newly cerated reservation successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            if (newlyCreatedReservation) {
                const response = yield (0, supertest_1.default)(app.express)
                    .delete(`/api/reservations/${newlyCreatedReservation}`)
                    .set('Authorization', `Bearer ${authToken}`);
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    message: 'Reservation deleted successfully',
                });
            }
        }));
    });
});
//# sourceMappingURL=reservation.controller.test.js.map