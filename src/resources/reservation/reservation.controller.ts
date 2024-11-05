import { NextFunction, Request, Response, Router } from 'express';
import adminMiddleware from '../../middleware/admin.middleware';
import authenticated from '../../middleware/authenticated.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import ReservationService from '../../resources/reservation/reservation.service';
import validate from '../../resources/reservation/reservation.validation';
import HttpException from '../../utils/exceptions/http.exception';
import Controller from '../../utils/interfaces/controller.interface';

class ReservationController implements Controller {
    public path = '/reservations';
    public router = Router();
    private reservationService = new ReservationService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            authenticated,
            validationMiddleware(validate.create),
            this.createReservation
        );
        this.router.get(`${this.path}/:id`, authenticated, this.getReservation);
        this.router.get(
            `${this.path}`,
            authenticated,
            adminMiddleware,
            this.getReservations
        );
        this.router.delete(
            `${this.path}/:id`,
            authenticated,
            adminMiddleware,
            this.deleteReservation
        );
    }

    /**
     * @swagger
     * /api/reservations/create:
     *   post:
     *     tags:
     *       - "Reservation"
     *     summary: "Create a new reservation"
     *     description: "Creates a reservation with user ID, event ID, seats, start and end dates."
     *     operationId: "createReservation"
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *                 example: "cm31rajqh0000a4sld5dagd96"
     *               eventId:
     *                 type: string
     *                 example: "cm32hl3270003qel6tai7ig1r"
     *               seats:
     *                 type: integer
     *                 example: 3
     *               startDate:
     *                 type: string
     *                 format: date
     *                 example: "2024-11-01"
     *               endDate:
     *                 type: string
     *                 format: date
     *                 example: "2024-11-02"
     *     responses:
     *       '201':
     *         description: Reservation created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Reservation created successfully"
     *                 data:
     *                   type: object
     *                   additionalProperties: true
     *       '400':
     *         description: Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Invalid request data"
     *
     */
    private createReservation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId, eventId, seats, startDate, endDate } = req.body;

            const reservation = await this.reservationService.createReservation(
                userId,
                eventId,
                seats,
                startDate,
                endDate
            );

            res.status(201).json({
                message: 'Reservation created successfully',
                data: reservation,
            });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**
     * @swagger
     * /api/reservations/{id}:
     *   get:
     *     tags:
     *       - "Reservation"
     *     summary: "Get a reservation by ID"
     *     description: "Retrieves reservation details by reservation ID."
     *     operationId: "getReservation"
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the reservation to retrieve
     *     responses:
     *       '200':
     *         description: Reservation retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Reservation retrieved successfully"
     *                 data:
     *                   type: object
     *                   additionalProperties: true
     *       '404':
     *         description: Reservation not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Reservation not found"
     *
     */
    private getReservation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const reservation =
                await this.reservationService.getReservation(id);
            if (!reservation)
                throw new HttpException(404, 'Reservation not found');
            res.status(200).json({
                message: 'Reservation retrieved successfully',
                data: reservation,
            });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**
     * @swagger
     * /api/reservations:
     *   get:
     *     tags:
     *       - "Reservation"
     *     summary: "Retrieve all reservations"
     *     description: "Retrieves a list of all reservations."
     *     operationId: "getReservations"
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Reservations retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Reservations retrieved successfully"
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     additionalProperties: true
     *       '400':
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Bad request"
     */

    private getReservations = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const reservations =
                await this.reservationService.getReservations();
            res.status(200).json({
                message: 'Reservations retrieved successfully',
                data: reservations,
            });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    protected deleteReservation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | any> => {
        try {
            const { id } = req.params;
            await this.reservationService.deleteReservation(id);
            res.status(200).json({
                message: 'Reservation deleted successfully',
            });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default ReservationController;
