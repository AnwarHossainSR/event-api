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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'host.docker.internal',
            port: parseInt(process.env.SMTP_PORT || '1025'),
        });
        this.prisma = new client_1.PrismaClient();
    }
    sendQueuedEmails() {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingEmails = yield this.prisma.emailQueue.findMany({
                where: { status: 'PENDING' },
                take: 10,
            });
            for (const email of pendingEmails) {
                try {
                    const emailOption = {
                        from: process.env.DEFAULT_SENDER_EMAIL,
                        to: email.to,
                        subject: email.subject,
                        text: email.body,
                    };
                    yield this.transporter.sendMail(emailOption);
                    yield this.prisma.emailQueue.update({
                        where: { id: email.id },
                        data: { status: 'SENT' },
                    });
                }
                catch (error) {
                    console.error(`Failed to send email to ${email.to}:`, error);
                    yield this.prisma.emailQueue.update({
                        where: { id: email.id },
                        data: { status: 'FAILED' },
                    });
                }
            }
        });
    }
}
exports.default = new EmailService();
//# sourceMappingURL=emailService.js.map