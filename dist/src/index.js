"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const event_controller_1 = __importDefault(require("./resources/event/event.controller"));
const reservation_controller_1 = __importDefault(require("./resources/reservation/reservation.controller"));
const user_controller_1 = __importDefault(require("./resources/user/user.controller"));
const emailJob_1 = __importDefault(require("./utils/jobs/emailJob"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
(0, validateEnv_1.default)();
const app = new app_1.default([new user_controller_1.default(), new event_controller_1.default(), new reservation_controller_1.default()], Number(process.env.PORT));
new emailJob_1.default();
app.listen();
//# sourceMappingURL=index.js.map