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
const node_cron_1 = __importDefault(require("node-cron"));
const emailService_1 = __importDefault(require("../emailService"));
class EmailJob {
    constructor() {
        this.start();
    }
    sendQueuedEmails() {
        return __awaiter(this, void 0, void 0, function* () {
            yield emailService_1.default.sendQueuedEmails();
        });
    }
    start() {
        node_cron_1.default.schedule('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Running email queue processor...');
            yield this.sendQueuedEmails();
        }));
    }
}
exports.default = EmailJob;
//# sourceMappingURL=emailJob.js.map