import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import EventController from './resources/event/event.controller';
import ReservationController from './resources/reservation/reservation.controller';
import UserController from './resources/user/user.controller';
import EmailJob from './utils/jobs/emailJob';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [new UserController(), new EventController(), new ReservationController()],
    Number(process.env.PORT)
);
new EmailJob();
app.listen();
