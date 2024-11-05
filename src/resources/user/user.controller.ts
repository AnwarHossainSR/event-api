import authenticated from '../../middleware/authenticated.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import UserService from '../../resources/user/user.service';
import validate from '../../resources/user/user.validation';
import HttpException from '../../utils/exceptions/http.exception';
import Controller from '../../utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.get(`/me`, authenticated, this.getUser);
    }

    /**
     * @swagger
     * /api/users/register:
     *   post:
     *     tags:
     *       - "User"
     *     description: "Register User"
     *     operationId: "registerUser"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Mahedi Hasan"
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "test@gmail.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "123456"
     *     responses:
     *       '201':
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       '400':
     *         description: Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Message = Invalid request
     *
     */
    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const token = await this.userService.register(
                name,
                email,
                password
            );
            res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**
     * @swagger
     * /api/users/login:
     *   post:
     *     tags:
     *       - "User"
     *     description: "Login User"
     *     operationId: "loginUser"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "admin@admin.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "123456"
     *     responses:
     *       '200':
     *         description: User logged in successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       '400':
     *         description: Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Message = Invalid request
     *
     */
    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**
     * @swagger
     * /api/me:
     *   get:
     *     tags: [User]
     *     description: "Get logged in user details"
     *     operationId: "getMe"
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: User details retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: object
     *                   additionalProperties: true
     *       '404':
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Message = No logged-in user
     *
     */
    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged-in user'));
        }
        res.status(200).send({ data: req.user });
    };
}

export default UserController;
