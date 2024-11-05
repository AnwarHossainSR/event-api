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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the admin user exists
        const adminEmail = 'admin@admin.com';
        const existingAdmin = yield prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (!existingAdmin) {
            // If admin does not exist, create it
            const admin = yield prisma.user.create({
                data: {
                    name: 'Admin',
                    email: adminEmail,
                    password: yield bcrypt_1.default.hash('123456', 10), // Hashing the password
                    role: 'ADMIN',
                },
            });
            console.log(`Admin user created: ${admin.email}`);
        }
        else {
            console.log(`Admin user already exists: ${existingAdmin.email}`);
        }
        // Check if the regular user exists
        const userEmail = 'user@user.com';
        const existingUser = yield prisma.user.findUnique({
            where: { email: userEmail },
        });
        if (!existingUser) {
            // If user does not exist, create it
            const user = yield prisma.user.create({
                data: {
                    name: 'User',
                    email: userEmail,
                    password: yield bcrypt_1.default.hash('123456', 10), // Hashing the password
                    role: 'USER',
                },
            });
            console.log(`Regular user created: ${user.email}`);
        }
        else {
            console.log(`Regular user already exists: ${existingUser.email}`);
        }
    });
}
main()
    .catch(e => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map