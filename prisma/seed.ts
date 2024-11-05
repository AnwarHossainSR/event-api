import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Check if the admin user exists
    const adminEmail = 'admin@admin.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        // If admin does not exist, create it
        const admin = await prisma.user.create({
            data: {
                name: 'Admin',
                email: adminEmail,
                password: await bcrypt.hash('123456', 10), // Hashing the password
                role: 'ADMIN',
            },
        });
        console.log(`Admin user created: ${admin.email}`);
    } else {
        console.log(`Admin user already exists: ${existingAdmin.email}`);
    }

    // Check if the regular user exists
    const userEmail = 'user@user.com';
    const existingUser = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!existingUser) {
        // If user does not exist, create it
        const user = await prisma.user.create({
            data: {
                name: 'User',
                email: userEmail,
                password: await bcrypt.hash('123456', 10), // Hashing the password
                role: 'USER',
            },
        });
        console.log(`Regular user created: ${user.email}`);
    } else {
        console.log(`Regular user already exists: ${existingUser.email}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
