import request from 'supertest';
import App from '../../../app';
import EventController from '../../event/event.controller';
import UserController from '../../user/user.controller';
import ReservationController from '../reservation.controller';
import ReservationService from '../reservation.service';

const reservationServiceMock = new ReservationService();

const app = new App(
    [new ReservationController(), new UserController(), new EventController()],
    Number(5000)
);
let authToken = '';
let newlyCreatedReservation = '';
let user: any = null;

describe('ReservationController', () => {
    beforeAll(async () => {
        // Log in to get a token
        const authResponse = await request(app.express)
            .post('/api/users/login')
            .send({
                email: 'admin@admin.com',
                password: '123456',
            });
        authToken = authResponse.body.token;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/reservations/create', () => {
        it('should create a new reservation', async () => {
            user = await request(app.express)
                .get('/api/me')
                .set('Authorization', `Bearer ${authToken}`);

            const events = await request(app.express).get('/api/events');

            if (events.body.data.length > 0) {
                const randomIndex = Math.floor(
                    Math.random() * events.body.data.length
                );
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

                jest.spyOn(
                    reservationServiceMock,
                    'createReservation'
                ).mockResolvedValueOnce(newReservation);

                const response = await request(app.express)
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
                expect(response.body).toEqual(
                    expect.objectContaining({
                        message: 'Reservation created successfully',
                        data: expect.objectContaining({
                            userId: newReservation.userId,
                            eventId: newReservation.eventId,
                            seats: newReservation.seats,
                            startDate: newReservation.startDate,
                            endDate: newReservation.endDate,
                        }),
                    })
                );
            }
        });

        it('should return insufficient available seats error', async () => {
            const events = await request(app.express).get('/api/events');

            if (events.body.data.length > 0) {
                const randomIndex = Math.floor(
                    Math.random() * events.body.data.length
                );
                const singleEvent = events.body.data[randomIndex];
                const response = await request(app.express)
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
                expect(response.body).toEqual(
                    expect.objectContaining({
                        message: 'Not enough available seats',
                    })
                );
            }
        });

        it('should return a validation error if the request body is invalid', async () => {
            const invalidReservation = {
                userId: '',
                eventId: 'cm32hl3270003qel6tai7ig1r',
                seats: -1,
                startDate: 'invalid-date',
                endDate: '2024-11-02',
            };

            const response = await request(app.express)
                .post('/api/reservations/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidReservation);

            expect(response.status).toBe(400);
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: 'Validation Error',
                })
            );
        });
    });

    describe('GET /api/reservations/:id', () => {
        it('should retrieve a reservation by ID', async () => {
            if (newlyCreatedReservation) {
                const response = await request(app.express)
                    .get(`/api/reservations/${newlyCreatedReservation}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        message: 'Reservation retrieved successfully',
                    })
                );
            }
        });

        it('should return a 404 error if the reservation is not found', async () => {
            jest.spyOn(
                reservationServiceMock,
                'getReservation'
            ).mockRejectedValueOnce(new Error('Reservation not found'));

            const response = await request(app.express)
                .get('/api/reservations/999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'Reservation not found',
                status: 400,
            });
        });

        it('should delete an newly cerated reservation successfully', async () => {
            if (newlyCreatedReservation) {
                const response = await request(app.express)
                    .delete(`/api/reservations/${newlyCreatedReservation}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    message: 'Reservation deleted successfully',
                });
            }
        });
    });
});
