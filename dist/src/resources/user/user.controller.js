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
const authenticated_middleware_1 = __importDefault(require("../../middleware/authenticated.middleware"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const user_service_1 = __importDefault(require("../../resources/user/user.service"));
const user_validation_1 = __importDefault(require("../../resources/user/user.validation"));
const http_exception_1 = __importDefault(require("../../utils/exceptions/http.exception"));
const express_1 = require("express");
class UserController {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.userService = new user_service_1.default();
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
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const token = yield this.userService.register(name, email, password);
                res.status(201).json({ token });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
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
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = yield this.userService.login(email, password);
                res.status(200).json({ token });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
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
        this.getUser = (req, res, next) => {
            if (!req.user) {
                return next(new http_exception_1.default(404, 'No logged-in user'));
            }
            res.status(200).send({ data: req.user });
        };
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/register`, (0, validation_middleware_1.default)(user_validation_1.default.register), this.register);
        this.router.post(`${this.path}/login`, (0, validation_middleware_1.default)(user_validation_1.default.login), this.login);
        this.router.get(`/me`, authenticated_middleware_1.default, this.getUser);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map