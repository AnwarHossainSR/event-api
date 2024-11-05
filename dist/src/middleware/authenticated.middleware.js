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
const http_exception_1 = __importDefault(require("../utils/exceptions/http.exception"));
const token_1 = __importDefault(require("../utils/token"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
function authenticatedMiddleware(req, _res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bearer = req.headers.authorization;
        if (!bearer || !bearer.startsWith('Bearer ')) {
            return next(new http_exception_1.default(401, 'Unauthorized'));
        }
        const accessToken = bearer.split('Bearer ')[1].trim();
        try {
            const payload = yield token_1.default.verifyToken(accessToken);
            if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new http_exception_1.default(401, 'Unauthorized'));
            }
            // Handle ObjectId conversion to string safely
            const userId = typeof payload.id === 'object'
                ? payload.id
                : payload.id;
            const user = yield prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, email: true, role: true, name: true },
            });
            if (!user) {
                return next(new http_exception_1.default(401, 'Unauthorized'));
            }
            req.user = user; // Make sure req.user is of type User
            return next();
        }
        catch (error) {
            return next(new http_exception_1.default(401, 'Unauthorized'));
        }
    });
}
exports.default = authenticatedMiddleware;
//# sourceMappingURL=authenticated.middleware.js.map