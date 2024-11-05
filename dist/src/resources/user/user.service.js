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
const token_1 = __importDefault(require("../../utils/token"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    register(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExists = yield this.prisma.user.findUnique({
                    where: { email },
                });
                if (isExists) {
                    throw new Error('User already exists');
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                const userData = {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'USER',
                };
                const user = yield this.prisma.user.create({
                    data: userData,
                });
                const accessToken = token_1.default.createToken(user);
                return accessToken;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.prisma.user.findUnique({
                    where: { email },
                });
                if (!user) {
                    throw new Error('User not found');
                }
                const isPasswordValid = yield this.isValidPassword(user.password, password);
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }
                const accessToken = token_1.default.createToken(user);
                return accessToken;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    isValidPassword(hashedPassword, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hashedPassword);
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map