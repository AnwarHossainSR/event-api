import { PrismaClient, Reservation } from '@prisma/client';
import HttpException from '../../utils/exceptions/http.exception';

class ReservationService {
    private prisma = new PrismaClient();

    public async createReservation(
        userId: string,
        eventId: string,
        seats: number,
        startDate: Date,
        endDate: Date
    ): Promise<Reservation> {
        try {
            return await this.prisma.$transaction(async transaction => {
                const event = await transaction.event.findUnique({
                    where: { id: eventId },
                    select: {
                        availableSeats: true,
                        startDate: true,
                        endDate: true,
                    },
                });

                if (!event) {
                    throw new HttpException(404, 'Invalid event ID');
                }

                // Check if the requested seats are available
                if (event.availableSeats < seats) {
                    throw new HttpException(400, 'Not enough available seats');
                }

                // Check if reservation dates are within the event's dates
                if (startDate < event.startDate || endDate > event.endDate) {
                    throw new HttpException(
                        400,
                        'Reservation dates must be within the event duration'
                    );
                }

                // Check for overlapping reservations for the same user
                const existingReservation =
                    await transaction.reservation.findFirst({
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
                    throw new HttpException(
                        400,
                        'User already has a reservation for this event on the same date'
                    );
                }

                // Update the available seats in a transaction
                const updatedEvent = await transaction.event.update({
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
                    throw new HttpException(400, 'Not enough available seats');
                }

                // Create the reservation
                const reservation = await transaction.reservation.create({
                    data: {
                        startDate,
                        endDate,
                        seats,
                        user: { connect: { id: userId } },
                        event: { connect: { id: eventId } },
                    },
                });

                const user = await transaction.user.findUnique({
                    where: { id: userId },
                    select: { email: true, name: true },
                });

                if (user) {
                    await transaction.emailQueue.create({
                        data: {
                            to: user.email,
                            subject: 'Your Reservation Confirmation',
                            body: `Greeting ${user.name}!, \n\nYour reservation for ${eventId} has been confirmed. please find the details below:\n\nEvent Date: ${startDate}\nNumber of Seats: ${seats}\n\nThank you for using our service!`,
                        },
                    });
                }

                return reservation;
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getReservation(id: string): Promise<Reservation | null> {
        try {
            return await this.prisma.reservation.findUnique({
                where: { id },
                include: { user: true, event: true },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getReservations(): Promise<Reservation[]> {
        try {
            return await this.prisma.reservation.findMany({
                include: { user: true, event: true },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteReservation(id: string): Promise<void> {
        try {
            await this.prisma.reservation.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default ReservationService;
