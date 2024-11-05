import { Prisma, PrismaClient } from '@prisma/client';

class EventService {
    private prisma = new PrismaClient();

    public async createEvent(data: Prisma.EventCreateInput): Promise<any> {
        try {
            const startDate = data.startDate;
            const endDate = data.endDate;

            const overlapEvent = await this.prisma.event.findFirst({
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
                throw new Error(
                    'An event is already scheduled at this time and venue.'
                );
            }

            return await this.prisma.event.create({ data });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updateEvent(
        id: string,
        data: Prisma.EventUpdateInput
    ): Promise<any> {
        try {
            const event = await this.prisma.event.findUnique({ where: { id } });
            if (!event) throw new Error('Event not found');

            const venue = data.venue || event.venue;
            const startDate = data.startDate || event.startDate;
            const endDate = data.endDate || event.endDate;

            const whereConditions: Prisma.EventWhereInput = {
                id: { not: id },
                venue: venue as string,
                AND: [
                    {
                        startDate: { lte: endDate as Date },
                    },
                    {
                        endDate: { gte: startDate as Date },
                    },
                ] as Prisma.EventWhereInput[],
            };

            // Check for overlapping events if venue, startDate, or endDate are provided
            const overlapEvent = await this.prisma.event.findFirst({
                where: whereConditions,
            });

            if (overlapEvent) {
                throw new Error(
                    'Another event is already scheduled at this time and venue.'
                );
            }

            // Prepare the update data
            const updateData: Prisma.EventUpdateInput = {
                ...data, // Include any other fields from data
                venue,
                startDate,
                endDate,
            };

            // Perform the update
            return await this.prisma.event.update({
                where: { id },
                data: updateData,
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteEvent(id: string): Promise<void> {
        try {
            const event = await this.prisma.event.findUnique({ where: { id } });
            if (!event) throw new Error('Event not found');

            //check for reservation
            const reservation = await this.prisma.reservation.findFirst({
                where: { eventId: id },
            });
            if (reservation) {
                throw new Error('Event is reserved by a user');
            }

            await this.prisma.event.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getEvents(): Promise<any[]> {
        try {
            return await this.prisma.event.findMany();
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getEvent(id: string): Promise<any> {
        try {
            const event = await this.prisma.event.findUnique({ where: { id } });
            if (!event) throw new Error('Event not found');
            return event;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default EventService;
