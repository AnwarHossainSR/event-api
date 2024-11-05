import request from 'supertest';
import App from '../../../app';
import { generateUniqueEvent } from '../../../utils/helper';
import UserController from '../../user/user.controller';
import EventController from '../event.controller';
import EventService from '../event.service';

const eventServiceMock = new EventService();

const app = new App(
    [new EventController(), new UserController()],
    Number(5000)
);
let authToken = '';
let newlyCreatedEventId = '';

describe('EventController', () => {
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

    describe('GET /api/events', () => {
        it('should return a list of events', async () => {
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
            jest.spyOn(eventServiceMock, 'getEvents').mockResolvedValueOnce(
                mockEvents
            );

            const response = await request(app.express).get('/api/events');

            expect(response.status).toBe(200);
        });

        it('should return a 404 error if the API route does not exist', async () => {
            const response = await request(app.express).get(
                '/api/nonexistent-route'
            );

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/events', () => {
        it('Should create a new event', async () => {
            const newEvent = generateUniqueEvent();

            jest.spyOn(eventServiceMock, 'createEvent').mockResolvedValueOnce(
                newEvent
            );

            const response = await request(app.express)
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
        });

        it('should return a validation error if the request body is invalid', async () => {
            const invalidEvent = {
                name: '',
                startDate: 'invalid-date',
            };

            const response = await request(app.express)
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
        });
    });

    describe('PUT /api/events/:id', () => {
        it('should update an existing event', async () => {
            const updatedEvent = {
                name: 'Updated Event',
                totalSeats: 250,
                availableSeats: 220,
            };

            jest.spyOn(eventServiceMock, 'updateEvent').mockResolvedValueOnce(
                updatedEvent
            );

            const response = await request(app.express)
                .put(`/api/events/${newlyCreatedEventId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedEvent);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: 'Event updated successfully',
                })
            );
        });

        it('should return a 404 error if the event is not found', async () => {
            jest.spyOn(eventServiceMock, 'updateEvent').mockRejectedValueOnce(
                new Error('Event not found')
            );
            const response = await request(app.express)
                .put('/api/events/999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Nonexistent Event' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'Event not found',
                status: 400,
            });
        });
    });

    describe('DELETE /api/events/:id', () => {
        it('should delete an event successfully', async () => {
            if (newlyCreatedEventId) {
                jest.spyOn(
                    eventServiceMock,
                    'deleteEvent'
                ).mockResolvedValueOnce(undefined);

                const response = await request(app.express)
                    .delete(`/api/events/${newlyCreatedEventId}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(204);
                expect(response.body).toEqual({});
            }
        });

        it('should return a 404 error if the event is not found', async () => {
            jest.spyOn(eventServiceMock, 'deleteEvent').mockRejectedValueOnce(
                new Error('Event not found')
            );

            const response = await request(app.express)
                .delete('/api/events/999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                message: 'Event not found',
                status: 404,
            });
        });
    });
});
