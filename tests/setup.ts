import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
});

// beforeEach(async () => {
//     await prisma.event.deleteMany(); // Clear the database for a clean slate
//     // Seed the database if needed
// });

afterAll(async () => {
    await prisma.$disconnect();
});

export default prisma;
